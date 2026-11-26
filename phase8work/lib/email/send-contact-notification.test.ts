import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendContactNotificationEmails } from './send-contact-notification';

const ENV_KEYS = ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'CONTACT_NOTIFY_EMAIL'] as const;
let saved: Record<string, string | undefined>;

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM_EMAIL = 'chapter@example.edu';
  process.env.CONTACT_NOTIFY_EMAIL = 'officers@example.edu';
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const contactInput = {
  name: 'Jane Visitor',
  email: 'jane@example.com',
  topic: 'general',
  message: 'Hello, I had a question.',
};

describe('sendContactNotificationEmails', () => {
  it('sends both the chapter notification and the submitter confirmation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    const results = await sendContactNotificationEmails(contactInput);
    expect(results).toEqual([{ sent: true }, { sent: true }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const notifyBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(notifyBody.to).toEqual(['officers@example.edu']);
    expect(notifyBody.reply_to).toBe('jane@example.com');
    expect(notifyBody.subject).toContain('General Inquiry');
    expect(notifyBody.subject).toContain('Jane Visitor');

    const confirmBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(confirmBody.to).toEqual(['jane@example.com']);
    expect(confirmBody.reply_to).toBeUndefined();
  });

  it('skips the chapter notification entirely when CONTACT_NOTIFY_EMAIL is not configured', async () => {
    delete process.env.CONTACT_NOTIFY_EMAIL;
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    const results = await sendContactNotificationEmails(contactInput);
    expect(results).toEqual([{ sent: true }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).to).toEqual(['jane@example.com']);
  });

  it('escapes HTML special characters from user input so they cannot inject markup', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    await sendContactNotificationEmails({
      name: '<script>alert(1)</script>',
      email: 'attacker@example.com',
      topic: 'general',
      message: 'Message with "quotes" & an <img src=x> tag.',
    });
    const notifyBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(notifyBody.html).not.toContain('<script>alert(1)</script>');
    expect(notifyBody.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(notifyBody.html).toContain('&quot;quotes&quot;');
    expect(notifyBody.html).toContain('&amp; an &lt;img src=x&gt; tag.');
  });

  it('falls back to the raw topic string when it is not in the known label map', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    await sendContactNotificationEmails({ ...contactInput, topic: 'something-unlisted' });
    const notifyBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(notifyBody.subject).toContain('something-unlisted');
  });

  it('reports not-sent for both emails when Resend is not configured, without calling fetch', async () => {
    delete process.env.RESEND_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const results = await sendContactNotificationEmails(contactInput);
    expect(results).toEqual([
      { sent: false, error: 'Missing RESEND_API_KEY or RESEND_FROM_EMAIL.' },
      { sent: false, error: 'Missing RESEND_API_KEY or RESEND_FROM_EMAIL.' },
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('surfaces a per-email error from Resend without failing the other email', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(400, { message: 'invalid reply-to' }))
      .mockResolvedValueOnce(jsonResponse(200, {}));
    vi.stubGlobal('fetch', fetchMock);
    const results = await sendContactNotificationEmails(contactInput);
    expect(results).toEqual([{ sent: false, error: 'invalid reply-to' }, { sent: true }]);
  });
});
