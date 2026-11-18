const RESEND_BATCH_URL = 'https://api.resend.com/emails/batch';
const BATCH_SIZE = 100;
const DELAY_BETWEEN_BATCHES_MS = 600;

export type NewsletterMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl?: string;
};

export type NewsletterSendResult = {
  mode: 'preview' | 'resend';
  sent: number;
  failed: number;
  errors: string[];
};

export function hasResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends one email per recipient through Resend's batch endpoint, 100 at a
 * time, one batch after another so we stay under Resend's rate limit.
 * Each message is individual (recipients never see each other).
 */
export async function sendNewsletterBatch(messages: NewsletterMessage[]): Promise<NewsletterSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { mode: 'preview', sent: 0, failed: messages.length, errors: ['Email sending is not set up (RESEND_API_KEY or RESEND_FROM_EMAIL missing).'] };
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const chunk = messages.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((message) => ({
      from,
      to: [message.to],
      subject: message.subject,
      html: message.html,
      text: message.text,
      ...(message.unsubscribeUrl
        ? {
            headers: {
              'List-Unsubscribe': `<${message.unsubscribeUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }
        : {}),
    }));

    let attempt = 0;
    let done = false;
    while (!done) {
      attempt += 1;
      try {
        const response = await fetch(RESEND_BATCH_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.status === 429 && attempt < 4) {
          await sleep(1500 * attempt);
          continue;
        }

        if (response.ok) {
          sent += chunk.length;
        } else {
          const body = await response.json().catch(() => ({}));
          failed += chunk.length;
          errors.push(body?.message || `Resend returned status ${response.status}.`);
        }
      } catch (error) {
        failed += chunk.length;
        errors.push(error instanceof Error ? error.message : 'Network error while sending.');
      }
      done = true;
    }

    if (i + BATCH_SIZE < messages.length) await sleep(DELAY_BETWEEN_BATCHES_MS);
  }

  return { mode: 'resend', sent, failed, errors };
}
