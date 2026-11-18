import Image from 'next/image';
import type { Metadata } from 'next';
import { HandHeart, HeartPulse, Users } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Service',
  description: 'How Phi Delta Theta Connecticut Epsilon puts rectitude into action through national and local service.',
};

const actionIcons = [HeartPulse, Users, HandHeart];

export default async function ServicePage() {
  const c = await getPageContent('service');
  const pillars = items(c, 'pillar', 4, ['title', 'eyebrow', 'description', 'linkLabel', 'href'] as const);
  const actionCards = items(c, 'actionCard', 6, ['title', 'description'] as const);

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
        image={c.heroImage || undefined}
        imageAlt={c.heroImageAlt}
        imagePosition="center 40%"
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

      {pillars.length ? (
        <SectionShell eyebrow={c.pillarsEyebrow} title={c.pillarsTitle} description={c.pillarsDescription}>
          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <PathwayCard key={pillar.title} {...pillar} href={pillar.href || '/contact'} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      <section className="section-padding bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            {c.storyImage ? (
              <div className="image-frame min-h-[24rem] lg:min-h-[28rem]">
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

      {actionCards.length ? (
        <SectionShell eyebrow={c.actionEyebrow} title={c.actionTitle}>
          <div className="grid gap-6 sm:grid-cols-3">
            {actionCards.map((card, index) => {
              const Icon = actionIcons[index % actionIcons.length];
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
