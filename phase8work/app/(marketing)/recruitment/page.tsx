import Image from 'next/image';
import type { Metadata } from 'next';
import { CalendarCheck, HandHeart, MessagesSquare, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Recruitment',
  description: 'Learn how to join Phi Delta Theta Connecticut Epsilon at Quinnipiac University.',
};

const stepIcons = [MessagesSquare, CalendarCheck, ShieldCheck, HandHeart];

export default async function RecruitmentPage() {
  const [c, site] = await Promise.all([getPageContent('recruitment'), getPageContent('site')]);
  const lookFor = items(c, 'lookForCard', 6, ['title', 'eyebrow', 'description', 'linkLabel', 'href'] as const);
  const steps = items(c, 'step', 8, ['title', 'description'] as const);
  const principles = items(site, 'principle', 3, ['title', 'description'] as const);

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
        image={c.heroImage || undefined}
        imageAlt={c.heroImageAlt}
        imagePosition="center 35%"
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

      {c.mottoImage ? (
        <section className="section-padding pb-0">
          <Container>
            <div className="surface flex flex-col items-center gap-4 p-8 text-center md:p-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.mottoImage} alt={c.mottoImageAlt} className="h-32 w-auto rounded-2xl" />
              {c.mottoCaption ? <p className="max-w-xl text-sm text-fraternity-slate">{c.mottoCaption}</p> : null}
            </div>
          </Container>
        </section>
      ) : null}

      {lookFor.length ? (
        <SectionShell eyebrow={c.lookForEyebrow} title={c.lookForTitle} description={c.lookForDescription}>
          <div className="grid gap-6 lg:grid-cols-3">
            {lookFor.map((item) => (
              <PathwayCard key={item.title} {...item} href={item.href || '/contact'} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      <section className="section-padding bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            {c.valuesImage ? (
              <div className="image-frame min-h-[24rem] lg:min-h-[28rem]">
                <Image src={c.valuesImage} alt={c.valuesImageAlt} fill sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
              </div>
            ) : null}
            <div>
              <p className="eyebrow">{c.valuesEyebrow}</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">{c.valuesTitle}</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-1">
                {principles.map((value) => (
                  <div key={value.title}>
                    <h3 className="text-lg font-semibold text-fraternity-charcoal">{value.title}</h3>
                    <p className="mt-1 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {steps.length ? (
        <SectionShell eyebrow={c.processEyebrow} title={c.processTitle} description={c.processDescription}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = stepIcons[index % stepIcons.length];
              return (
                <article key={step.title} className="surface p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fraternity-azure/10 text-fraternity-azure">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-2xl">{step.title}</h3>
                  <p className="mt-4 text-sm">{step.description}</p>
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
