import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendAlumniClaimEmail } from './send-alumni-claim-email';
import { sendActiveClaimEmail } from './send-active-claim-email';

const ENV_KEYS = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL'] as const;
let saved: Record<string, string | undefined>;

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM_EMAIL = 'chapter@example.edu';
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const claimInput = {
  to: 'brother@example.edu',
  claimUrl: 'https://qupd-twebsite.vercel.app/active/claim/token-123',
  expiresAt: '2027-06-01T12:00:00.000Z',
};

describe.each([
  ['sendAlumniClaimEmail', sendAlumniClaimEmail, 'Claim your alumni account'],
  ['sendActiveClaimEmail', sendActiveClaimEmail, 'Claim your active member account'],
] as const)('%s', (_name, sendFn, expectedSubject) => {
  it('returns preview mode without calling fetch when Resend is not configured', async () => {
    delete process.env.RESEND_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendFn(claimInput);
    expect(result).toEqual({
      sent: false,
      mode: 'preview',
      error: 'Missing RESEND_API_KEY or RESEND_FROM_EMAIL.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the claim email with the correct subject, recipient, and link', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { id: 'email_1' }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendFn(claimInput);
    expect(result).toEqual({ sent: true, mode: 'resend' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    const body = JSON.parse(init.body);
    expect(body.from).toBe('chapter@example.edu');
    expect(body.to).toEqual([claimInput.to]);
    expect(body.subject).toBe(expectedSubject);
    expect(body.html).toContain(claimInput.claimUrl);
    expect(body.text).toContain(claimInput.claimUrl);
  });

  it('reports the Resend error message when the send fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(400, { message: 'invalid recipient' }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendFn(claimInput);
    expect(result).toEqual({ sent: false, mode: 'resend', error: 'invalid recipient' });
  });

  it('falls back to a generic error message when the error body has no message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(500, {}));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendFn(claimInput);
    expect(result).toEqual({ sent: false, mode: 'resend', error: 'Email failed to send.' });
  });
});
