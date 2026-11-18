import Image from 'next/image';
import type { Metadata } from 'next';
import { BookOpen, BriefcaseBusiness, HeartHandshake, Users } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Brotherhood',
  description: 'Explore active chapter life, leadership, service, and lifelong brotherhood at Phi Delta Theta Connecticut Epsilon.',
};

const growthIcons = [BookOpen, BriefcaseBusiness, HeartHandshake, Users];

export default async function BrotherhoodPage() {
  const c = await getPageContent('brotherhood');
  const pathways = items(c, 'pathway', 6, ['title', 'eyebrow', 'description', 'linkLabel', 'href'] as const);
  const growthCards = items(c, 'growthCard', 8, ['title', 'description'] as const);

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
        image={c.heroImage || undefined}
        imageAlt={c.heroImageAlt}
        imagePosition="center 45%"
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

      {pathways.length ? (
        <SectionShell eyebrow={c.pathwaysEyebrow} title={c.pathwaysTitle} description={c.pathwaysDescription}>
          <div className="grid gap-6 lg:grid-cols-3">
            {pathways.map((pathway) => (
              <PathwayCard key={pathway.title} {...pathway} href={pathway.href || '/contact'} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      <section className="section-padding bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            {c.storyImage ? (
              <div className="image-frame min-h-[28rem]">
                <Image src={c.storyImage} alt={c.storyImageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </div>
            ) : null}
            <div>
              <p className="eyebrow">{c.storyEyebrow}</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">{c.storyTitle}</h2>
              <p className="mt-5 text-lg">{c.storyBody}</p>
              {c.storyBodySecondary ? <p className="mt-4">{c.storyBodySecondary}</p> : null}
              {c.storyButtonLabel ? (
                <Button href={c.storyButtonHref} variant="secondary" className="mt-7">
                  {c.storyButtonLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {growthCards.length ? (
        <SectionShell eyebrow={c.growthEyebrow} title={c.growthTitle} description={c.growthDescription}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {growthCards.map((card, index) => {
              const Icon = growthIcons[index % growthIcons.length];
              return (
                <article key={card.title} className="surface p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fraternity-azure/10 text-fraternity-azure">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-2xl">{card.title}</h3>
                  <p className="mt-4 text-sm">{card.description}</p>
                </article>
              );
            })}
          </div>
        </SectionShell>
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
