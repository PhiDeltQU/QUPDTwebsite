import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hasResendConfigured, sendNewsletterBatch, type NewsletterMessage } from './resend';

const ENV_KEYS = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL'] as const;
let saved: Record<string, string | undefined>;

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function makeMessages(count: number): NewsletterMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    to: `member${i}@example.edu`,
    subject: 'Chapter update',
    html: '<p>hi</p>',
    text: 'hi',
  }));
}

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM_EMAIL = 'chapter@example.edu';
  // sleep() just wraps setTimeout; firing it immediately keeps retry/batch-delay
  // tests fast without needing fake-timer advancement in a node environment.
  vi.stubGlobal(
    'setTimeout',
    ((fn: () => void) => {
      fn();
      return 0;
    }) as unknown as typeof setTimeout
  );
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('hasResendConfigured', () => {
  it('is true when both env vars are set', () => {
    expect(hasResendConfigured()).toBe(true);
  });

  it('is false when the API key is missing', () => {
    delete process.env.RESEND_API_KEY;
    expect(hasResendConfigured()).toBe(false);
  });

  it('is false when the from-address is missing', () => {
    delete process.env.RESEND_FROM_EMAIL;
    expect(hasResendConfigured()).toBe(false);
  });
});

describe('sendNewsletterBatch', () => {
  it('returns preview mode and fails every message when Resend is not configured', async () => {
    delete process.env.RESEND_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendNewsletterBatch(makeMessages(3));
    expect(result).toEqual({
      mode: 'preview',
      sent: 0,
      failed: 3,
      errors: ['Email sending is not set up (RESEND_API_KEY or RESEND_FROM_EMAIL missing).'],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a single batch successfully and reports the real sender/recipients', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { id: 'batch_1' }));
    vi.stubGlobal('fetch', fetchMock);
    const messages = makeMessages(5);
    const result = await sendNewsletterBatch(messages);
    expect(result).toEqual({ mode: 'resend', sent: 5, failed: 0, errors: [] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails/batch');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    const payload = JSON.parse(init.body);
    expect(payload).toHaveLength(5);
    expect(payload[0].from).toBe('chapter@example.edu');
    expect(payload[0].to).toEqual(['member0@example.edu']);
  });

  it('adds List-Unsubscribe headers only for messages that carry an unsubscribeUrl', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    const messages: NewsletterMessage[] = [
      { to: 'a@example.edu', subject: 's', html: '<p/>', text: 't', unsubscribeUrl: 'https://example.edu/unsub/a' },
      { to: 'b@example.edu', subject: 's', html: '<p/>', text: 't' },
    ];
    await sendNewsletterBatch(messages);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload[0].headers['List-Unsubscribe']).toBe('<https://example.edu/unsub/a>');
    expect(payload[1].headers).toBeUndefined();
  });

  it('splits more than 100 recipients into separate batches', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendNewsletterBatch(makeMessages(150));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toHaveLength(100);
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toHaveLength(50);
    expect(result).toEqual({ mode: 'resend', sent: 150, failed: 0, errors: [] });
  });

  it('records a failed batch with the error message Resend returns', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(422, { message: 'invalid from address' }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendNewsletterBatch(makeMessages(2));
    expect(result).toEqual({ mode: 'resend', sent: 0, failed: 2, errors: ['invalid from address'] });
  });

  it('falls back to a generic error message when the error body cannot be parsed', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => { throw new Error('not json'); } });
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendNewsletterBatch(makeMessages(1));
    expect(result.errors).toEqual(['Resend returned status 500.']);
  });

  it('retries on a 429 and succeeds once Resend stops rate-limiting', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(429, {}))
      .mockResolvedValueOnce(jsonResponse(429, {}))
      .mockResolvedValueOnce(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendNewsletterBatch(makeMessages(1));
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ mode: 'resend', sent: 1, failed: 0, errors: [] });
  });

  it('records a network error without throwing', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendNewsletterBatch(makeMessages(1));
    expect(result).toEqual({ mode: 'resend', sent: 0, failed: 1, errors: ['network down'] });
  });
});
