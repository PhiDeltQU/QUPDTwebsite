import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Unsubscribed',
  robots: { index: false },
};

const messages = {
  ok: {
    title: 'You have been unsubscribed',
    body: 'You will no longer receive chapter newsletter emails. If this was a mistake, you can sign up again anytime on the newsletter page.',
  },
  invalid: {
    title: 'That unsubscribe link did not work',
    body: 'The link may be incomplete or out of date. Use the unsubscribe link from your most recent newsletter email, or contact the chapter and we will remove you.',
  },
  error: {
    title: 'Something went wrong',
    body: 'We could not update your subscription just now. Please try the link again in a few minutes, or contact the chapter and we will remove you.',
  },
} as const;

export default async function UnsubscribedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const content = messages[(status as keyof typeof messages) || 'ok'] ?? messages.ok;

  return (
    <section className="py-24">
      <Container>
        <div className="surface mx-auto max-w-2xl p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Newsletter</p>
          <h1 className="mt-3 text-4xl">{content.title}</h1>
          <p className="mt-4 text-fraternity-slate">{content.body}</p>
          <div className="mt-8 flex justify-center gap-4 text-sm font-semibold">
            <Link href="/newsletter" className="text-fraternity-azure underline">Newsletter page</Link>
            <Link href="/contact" className="text-fraternity-azure underline">Contact the chapter</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
