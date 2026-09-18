import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/forms';
import { persistContactSubmission } from '@/lib/actions/persist';
import { sendContactNotificationEmails } from '@/lib/email/send-contact-notification';
import { checkRateLimit } from '@/lib/auth/rate-limit';

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip if not configured

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
  if (!data.success) {
    console.error('[contact] Turnstile verification failed:', data['error-codes']?.join(', ') || 'no error codes returned');
  }
  return data.success === true;
}

export async function POST(request: Request) {
  const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`contact:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please wait a while and try again.' }, { status: 429 });
  }

  const json = await request.json() as Record<string, unknown>;

  // Verify Turnstile token if the secret key is configured
  const token = typeof json['cf-turnstile-response'] === 'string' ? json['cf-turnstile-response'] : '';
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!token) {
      console.error('[contact] Submission arrived with no Turnstile token — the widget likely never rendered or completed (check the site key and its allowed domains in the Cloudflare Turnstile dashboard).');
      return NextResponse.json({ error: 'Verification did not load. Please refresh the page and try again.' }, { status: 400 });
    }
    const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for');
    const valid = await verifyTurnstile(token, ip);
    if (!valid) {
      return NextResponse.json({ error: 'Bot verification failed. Please try again.' }, { status: 400 });
    }
  } else {
    console.warn('[contact] TURNSTILE_SECRET_KEY is not set — bot verification is disabled for this submission.');
  }

  const result = contactSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistContactSubmission(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save contact submission.' }, { status: 500 });
  }

  // Send notification to chapter inbox + confirmation to submitter (non-blocking)
  sendContactNotificationEmails(result.data)
    .then((results) => {
      results.forEach((emailResult) => {
        if (!emailResult.sent) {
          console.error('[contact] Notification email not sent:', emailResult.error);
        }
      });
    })
    .catch((err) => {
      console.error('[contact] Email send failed:', err);
    });

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'Your message was saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.',
    topic: result.data.topic
  });
}
