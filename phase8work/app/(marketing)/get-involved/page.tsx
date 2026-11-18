import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Find ways to attend, mentor, share, reconnect, and support Phi Delta Theta Connecticut Epsilon.',
};

export default async function GetInvolvedPage() {
  const c = await getPageContent('get-involved');
  const options = items(c, 'option', 9, ['title', 'eyebrow', 'description', 'linkLabel', 'href'] as const);

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
        actions={
          <>
            {c.heroPrimaryLabel ? <Button href={c.heroPrimaryHref}>{c.heroPrimaryLabel}</Button> : null}
            {c.heroSecondaryLabel ? (
              <Button href={c.heroSecondaryHref} variant="secondary">
                {c.heroSecondaryLabel}
              </Button>
            ) : null}
          </>
        }
      />

      {options.length ? (
        <SectionShell eyebrow={c.optionsEyebrow} title={c.optionsTitle} description={c.optionsDescription}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {options.map((option) => (
              <PathwayCard key={option.title} {...option} href={option.href || '/contact'} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      <CTASection
        eyebrow={c.ctaEyebrow}
        title={c.ctaTitle}
        description={c.ctaDescription}
        actions={
          c.ctaButtonLabel ? (
            <Button href={c.ctaButtonHref} variant="secondary">
              {c.ctaButtonLabel}
            </Button>
          ) : null
        }
      />
    </>
  );
}
