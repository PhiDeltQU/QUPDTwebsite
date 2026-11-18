import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { siteBaseUrl, verifyUnsubscribeToken } from '@/lib/email/unsubscribe';

export const runtime = 'nodejs';

async function unsubscribe(email: string, token: string) {
  if (!email || !token || !verifyUnsubscribeToken(email, token)) return 'invalid' as const;

  const supabase = createServerSupabaseClient();
  if (!supabase) return 'ok' as const;

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ is_active: false })
    .ilike('email', email.replace(/[\%_]/g, (m) => `\${m}`));

  if (error) {
    console.error('[newsletter/unsubscribe]', error.message);
    return 'error' as const;
  }
  return 'ok' as const;
}

function params(request: Request) {
  const url = new URL(request.url);
  return {
    email: (url.searchParams.get('email') || '').trim().toLowerCase(),
    token: url.searchParams.get('token') || '',
  };
}

// Link clicked from the email footer.
export async function GET(request: Request) {
  const { email, token } = params(request);
  const status = await unsubscribe(email, token);
  return NextResponse.redirect(`${siteBaseUrl()}/newsletter/unsubscribed?status=${status}`, 303);
}

// One-click unsubscribe from mail apps (List-Unsubscribe-Post header).
export async function POST(request: Request) {
  const { email, token } = params(request);
  const status = await unsubscribe(email, token);
  return NextResponse.json({ status }, { status: status === 'ok' ? 200 : 400 });
}
