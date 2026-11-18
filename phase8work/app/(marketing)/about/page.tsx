import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';
import { ValueCard } from '@/components/cards/value-card';
import { TimelineItem } from '@/components/cards/timeline-item';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Our Chapter',
  description: 'Learn about Phi Delta Theta Connecticut Epsilon, its values, foundation, and growing chapter story at Quinnipiac University.',
};

export default async function AboutPage() {
  const [c, site] = await Promise.all([getPageContent('about'), getPageContent('site')]);
  const principles = items(site, 'principle', 3, ['title', 'description'] as const);
  const glance = items(c, 'glance', 5, ['value', 'label'] as const);
  const timeline = items(c, 'timelineItem', 8, ['year', 'title', 'description'] as const);
  const themes = [
    { title: c.themeOneTitle, description: c.themeOneDescription },
    { title: c.themeTwoTitle, description: c.themeTwoDescription },
    { title: c.themeThreeTitle, description: c.themeThreeDescription },
  ].filter((theme) => theme.title.trim());

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
        image={c.heroImage || undefined}
        imageAlt={c.heroImageAlt}
        imagePosition="center 55%"
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

      <SectionShell title={c.overviewTitle} description={c.overviewDescription}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface p-8 md:p-10">
            <p className="text-lg">{c.overviewBody}</p>
            {c.overviewBodySecondary ? <p className="mt-5">{c.overviewBodySecondary}</p> : null}
          </div>
          <div className="rounded-3xl bg-fraternity-charcoal p-8 text-white md:p-10">
            <Image src="/brand/phi-delt-wordmark.png" alt="Phi Delta Theta" width={1800} height={600} sizes="96px" className="h-8 w-auto" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-fraternity-argent">{c.glanceHeading}</p>
            <dl className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {glance.map((fact, index) => (
                <div
                  key={index}
                  className={
                    index === 0 ? '' : 'border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-5 lg:border-l-0 lg:border-t lg:pl-0'
                  }
                >
                  <dt className="text-sm text-white/55">{fact.label}</dt>
                  <dd className="mt-1 font-serif text-2xl">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </SectionShell>

      {principles.length ? (
        <section className="section-padding bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="eyebrow">{c.principlesEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{c.principlesTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{c.principlesDescription}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {principles.map((value) => (
                <ValueCard key={value.title} {...value} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {themes.length ? (
        <SectionShell eyebrow={c.themesEyebrow} title={c.themesTitle} description={c.themesDescription}>
          <div className="grid gap-6 md:grid-cols-3">
            {themes.map((theme, index) => (
              <article key={index} className="surface p-8">
                <p className="eyebrow">0{index + 1}</p>
                <h3 className="mt-4 text-2xl">{theme.title}</h3>
                <p className="mt-4">{theme.description}</p>
              </article>
            ))}
          </div>
        </SectionShell>
      ) : null}

      {timeline.length ? (
        <section className="section-padding bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="eyebrow">{c.timelineEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{c.timelineTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{c.timelineDescription}</p>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {timeline.map((item, index) => (
                <TimelineItem key={index} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection
        eyebrow={c.ctaEyebrow}
        title={c.ctaTitle}
        description={c.ctaDescription}
        actions={
          <>
            {c.ctaPrimaryLabel ? (
              <Button href={c.ctaPrimaryHref} variant="secondary">
                {c.ctaPrimaryLabel}
              </Button>
            ) : null}
            {c.ctaSecondaryLabel ? <Button href={c.ctaSecondaryHref}>{c.ctaSecondaryLabel}</Button> : null}
          </>
        }
      />
    </>
  );
}
