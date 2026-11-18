import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { newsletterHtmlTemplate, newsletterTextTemplate } from '@/lib/email/templates';
import { hasResendConfigured, sendNewsletterBatch } from '@/lib/email/resend';
import { siteBaseUrl, unsubscribeUrl } from '@/lib/email/unsubscribe';
import { readDemoStore, writeDemoStore } from '@/lib/demo-store';

export const runtime = 'nodejs';
export const maxDuration = 300;

const PAGE_SIZE = 1000;

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const newsletterId = typeof body?.newsletterId === 'string' ? body.newsletterId : '';
  const resend = body?.resend === true;
  if (!newsletterId) return NextResponse.json({ error: 'newsletterId is required.' }, { status: 400 });

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    const store = await readDemoStore();
    const issue = store.newsletters.find((entry) => entry.id === newsletterId);
    if (!issue) return NextResponse.json({ error: 'Newsletter not found.' }, { status: 404 });
    if (issue.status === 'sent' && !resend) {
      return NextResponse.json({ error: 'This issue was already sent.', alreadySent: true }, { status: 409 });
    }
    issue.status = 'sent';
    await writeDemoStore(store);
    return NextResponse.json({ ok: true, mode: 'demo', message: 'Demo mode: marked as sent. No emails were sent.' });
  }

  const { data: issue, error: issueError } = await supabase
    .from('newsletters')
    .select('id, title, slug, summary, body_content, subject_line, status')
    .eq('id', newsletterId)
    .maybeSingle();

  if (issueError || !issue) return NextResponse.json({ error: issueError?.message || 'Newsletter not found.' }, { status: 404 });

  if (issue.status === 'sent' && !resend) {
    return NextResponse.json({ error: 'This issue was already sent.', alreadySent: true }, { status: 409 });
  }

  if (!hasResendConfigured()) {
    return NextResponse.json(
      { error: 'Email sending is not set up yet (RESEND_API_KEY and RESEND_FROM_EMAIL are missing in Vercel). Nothing was sent.' },
      { status: 500 }
    );
  }

  // Load every active subscriber, 1000 at a time (Supabase caps a single query at 1000 rows).
  const emails = new Set<string>();
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('is_active', true)
      .order('email', { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const row of data || []) {
      const email = (row as { email: string | null }).email?.trim().toLowerCase();
      if (email) emails.add(email);
    }
    if (!data || data.length < PAGE_SIZE) break;
  }

  if (emails.size === 0) return NextResponse.json({ error: 'There are no active subscribers yet. Nothing was sent.' }, { status: 400 });

  const issueUrl = `${siteBaseUrl()}/newsletter/${issue.slug}`;
  const subject = issue.subject_line || issue.title;
  const messages = [...emails].map((email) => {
    const unsubscribe = unsubscribeUrl(email);
    const content = { title: issue.title, summary: issue.summary || '', body: issue.body_content || '', siteUrl: issueUrl, unsubscribeUrl: unsubscribe };
    return { to: email, subject, html: newsletterHtmlTemplate(content), text: newsletterTextTemplate(content), unsubscribeUrl: unsubscribe };
  });

  const result = await sendNewsletterBatch(messages);

  if (result.sent === 0) {
    return NextResponse.json(
      { error: `Nothing was sent. ${result.errors[0] || 'Unknown email error.'}` },
      { status: 500 }
    );
  }

  await supabase.from('newsletters').update({ status: 'sent' }).eq('id', newsletterId);

  const message =
    result.failed > 0
      ? `Sent to ${result.sent} subscribers. ${result.failed} could not be sent (${result.errors[0] || 'unknown error'}).`
      : `Sent to ${result.sent} subscribers.`;

  return NextResponse.json({ ok: true, mode: result.mode, sent: result.sent, failed: result.failed, message });
}
