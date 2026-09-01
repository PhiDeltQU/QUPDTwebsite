import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getNewsletters } from '@/lib/queries/public';
import { NewsletterCard } from '@/components/cards/newsletter-card';
import { NewsletterSignupForm } from '@/components/forms/newsletter-signup-form';

export default async function NewsletterPage() {
  const issues = await getNewsletters();
  return (
    <>
      <PageHero
        eyebrow="Newsletter & Communication"
        title="Stay connected to chapter news"
        description="Sign up to hear from Connecticut Epsilon directly, and catch up on past updates in the archive below."
      />
      <SectionShell title="Newsletter signup" description="Get chapter updates, event recaps, and alumni news sent directly to your inbox.">
        <NewsletterSignupForm />
      </SectionShell>
      <SectionShell eyebrow="Archive" title="Recent issues" description="Chapter updates and letters, archived here as they're published.">
        {issues.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {issues.map((issue) => (
              <NewsletterCard key={issue.slug} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">The first chapter newsletter will be published here soon.</p>
          </div>
        )}
      </SectionShell>
    </>
  );
}
