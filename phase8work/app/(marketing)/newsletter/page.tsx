import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getNewsletters } from '@/lib/queries/public';
import { NewsletterCard } from '@/components/cards/newsletter-card';
import { NewsletterSignupForm } from '@/components/forms/newsletter-signup-form';
import { getPageContent } from '@/lib/content/get-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Read chapter news and updates from Phi Delta Theta Connecticut Epsilon at Quinnipiac University.',
};

export const revalidate = 300;

export default async function NewsletterPage() {
  const [issues, c] = await Promise.all([getNewsletters(), getPageContent('newsletter')]);

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} description={c.heroDescription} />
      <SectionShell title={c.signupTitle} description={c.signupDescription}>
        <NewsletterSignupForm
          title={c.signupFormTitle}
          description={c.signupFormDescription}
          submitLabel={c.signupButtonLabel}
          successMessage={c.signupSuccessMessage}
        />
      </SectionShell>
      <SectionShell eyebrow={c.archiveEyebrow} title={c.archiveTitle} description={c.archiveDescription}>
        {issues.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {issues.map((issue) => (
              <NewsletterCard key={issue.slug} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">{c.archiveEmptyMessage}</p>
          </div>
        )}
      </SectionShell>
    </>
  );
}
