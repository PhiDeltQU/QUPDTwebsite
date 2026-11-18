import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/sections/section-shell';
import { alumniSpotlight } from '@/lib/constants/site';
import { ValueCard } from '@/components/cards/value-card';
import { EventCard } from '@/components/cards/event-card';
import { NewsletterCard } from '@/components/cards/newsletter-card';
import { PathwayCard } from '@/components/cards/pathway-card';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { Container } from '@/components/layout/container';
import { CTASection } from '@/components/sections/cta-section';
import { LinkedInGroupPopupFromSettings } from '@/components/sections/linkedin-group-popup-server';
import { isOn, items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';
import { getUpcomingEvents, getFeaturedSpotlight, getNewsletters } from '@/lib/queries/public';

export const revalidate = 300;

function gridCols(count: number) {
  if (count >= 4) return 'sm:grid-cols-4';
  if (count === 3) return 'sm:grid-cols-3';
  if (count === 2) return 'sm:grid-cols-2';
  return '';
}

export default async function HomePage() {
  const [c, site, allEvents, allNewsletters, featuredSpotlight] = await Promise.all([
    getPageContent('home'),
    getPageContent('site'),
    getUpcomingEvents(),
    getNewsletters(),
    getFeaturedSpotlight(),
  ]);

  const featuredEvents = allEvents.slice(0, 3);
  const recentNewsletters = allNewsletters.slice(0, 3);
  const facts = items(c, 'fact', 4, ['value', 'label'] as const);
  const pathways = items(c, 'pathway', 6, ['title', 'eyebrow', 'description', 'linkLabel', 'href'] as const);
  const principles = items(site, 'principle', 3, ['title', 'description'] as const);
  const photos = items(c, 'photo', 5, ['image', 'alt', 'label', 'title'] as const);

  // getFeaturedSpotlight returns the built in placeholder when nothing is featured in the database.
  const hasFeaturedSpotlight = featuredSpotlight.name !== alumniSpotlight.name;
  const spotlight = hasFeaturedSpotlight
    ? featuredSpotlight
    : isOn(c, 'spotlightFallbackShow')
      ? { name: c.spotlightFallbackName, role: c.spotlightFallbackRole, quote: c.spotlightFallbackQuote, story: c.spotlightFallbackStory }
      : null;

  return (
    <>
      <LinkedInGroupPopupFromSettings />
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
        image={c.heroImage || undefined}
        imageAlt={c.heroImageAlt}
        imagePosition="center 58%"
        actions={
          <>
            {c.heroPrimaryLabel ? <Button href={c.heroPrimaryHref}>{c.heroPrimaryLabel}</Button> : null}
            {c.heroSecondaryLabel ? (
              <Button href={c.heroSecondaryHref} variant="secondary">
                {c.heroSecondaryLabel}
              </Button>
            ) : null}
            {c.heroTertiaryLabel ? (
              <Button href={c.heroTertiaryHref} variant="ghost">
                {c.heroTertiaryLabel}
              </Button>
            ) : null}
          </>
        }
      />

      {facts.length ? (
        <section className="border-b border-black/5 bg-fraternity-charcoal py-5 text-white">
          <Container className={`grid gap-5 sm:divide-x sm:divide-white/15 ${gridCols(facts.length)}`}>
            {facts.map((fact, index) => (
              <div key={index} className="px-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">{fact.label}</p>
                <p className="mt-1 font-serif text-xl text-white">{fact.value}</p>
              </div>
            ))}
          </Container>
        </section>
      ) : null}

      <section className="section-padding">
        <Container className={`grid items-center gap-10 lg:gap-16 ${c.introImage ? 'lg:grid-cols-[0.78fr_1.22fr]' : ''}`}>
          {c.introImage ? (
            <div className="image-frame aspect-[4/5] min-h-[30rem]">
              <Image src={c.introImage} alt={c.introImageAlt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
            </div>
          ) : null}
          <div>
            <p className="eyebrow">{c.introEyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">{c.introTitle}</h2>
            <p className="mt-6 text-lg">{c.introBody}</p>
            {c.introBodySecondary ? <p className="mt-4">{c.introBodySecondary}</p> : null}
            {c.introPrimaryLabel || c.introSecondaryLabel ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {c.introPrimaryLabel ? <Button href={c.introPrimaryHref}>{c.introPrimaryLabel}</Button> : null}
                {c.introSecondaryLabel ? (
                  <Button href={c.introSecondaryHref} variant="secondary">
                    {c.introSecondaryLabel}
                  </Button>
                ) : null}
              </div>
            ) : null}
            {c.introLocationTitle ? (
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fraternity-azure/10 text-fraternity-azure">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm">
                  <span className="font-semibold text-fraternity-charcoal">{c.introLocationTitle}</span>
                  {c.introLocationText ? (
                    <>
                      <br />
                      {c.introLocationText}
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {pathways.length ? (
        <SectionShell eyebrow={c.missionEyebrow} title={c.missionTitle} description={c.missionDescription}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pathways.map((pathway) => (
              <PathwayCard key={pathway.title} {...pathway} href={pathway.href || '/'} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      {principles.length ? (
        <section className="section-padding bg-white">
          <Container>
            <div className="max-w-3xl">
              <p className="eyebrow">{c.valuesEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{c.valuesTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{c.valuesDescription}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {principles.map((value) => (
                <ValueCard key={value.title} title={value.title} description={value.description} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {photos.length ? (
        <SectionShell eyebrow={c.spotlightEyebrow} title={c.spotlightTitle} description={c.spotlightDescription}>
          <div className="grid auto-rows-[18rem] gap-5 md:grid-cols-2">
            {photos.map((story, index) => (
              <article key={index} className={`group image-frame ${index === 0 && photos.length > 1 ? 'md:row-span-2' : ''}`}>
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  {story.label ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">{story.label}</p> : null}
                  {story.title ? <h3 className="mt-2 text-2xl text-white">{story.title}</h3> : null}
                </div>
              </article>
            ))}
          </div>
        </SectionShell>
      ) : null}

      <section className="section-padding bg-white">
        <Container>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">{c.eventsEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{c.eventsTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{c.eventsDescription}</p>
            </div>
            {c.eventsButtonLabel ? (
              <Button href={c.eventsButtonHref} variant="secondary">
                {c.eventsButtonLabel}
              </Button>
            ) : null}
          </div>
          {featuredEvents.length ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <div className="surface mt-10 p-8">
              <p>{c.eventsEmpty}</p>
            </div>
          )}
        </Container>
      </section>

      <SectionShell eyebrow={c.newsletterEyebrow} title={c.newsletterTitle} description={c.newsletterDescription}>
        {recentNewsletters.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {recentNewsletters.map((issue) => (
              <NewsletterCard key={issue.slug} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p>{c.newsletterEmpty}</p>
          </div>
        )}
        {c.newsletterButtonLabel ? (
          <div className="mt-8">
            <Button href={c.newsletterButtonHref} variant="secondary">
              {c.newsletterButtonLabel}
            </Button>
          </div>
        ) : null}
      </SectionShell>

      {spotlight ? (
        <section className="section-padding bg-white">
          <Container className="max-w-3xl">
            <SpotlightCard spotlight={spotlight} />
          </Container>
        </section>
      ) : null}

      <section className={`section-padding ${spotlight ? 'pt-0' : ''}`}>
        <Container>
          <div className={`surface grid overflow-hidden ${c.legacyImage ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''}`}>
            <div className="p-8 md:p-12">
              <p className="eyebrow">{c.legacyEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{c.legacyTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{c.legacyDescription}</p>
              {c.legacyButtonLabel ? (
                <Button href={c.legacyButtonHref} className="mt-7">
                  {c.legacyButtonLabel} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              ) : null}
            </div>
            {c.legacyImage ? (
              <div className="relative min-h-[20rem]">
                <Image src={c.legacyImage} alt={c.legacyImageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow={c.finalCtaEyebrow}
        title={c.finalCtaTitle}
        description={c.finalCtaDescription}
        actions={
          <>
            {c.finalCtaPrimaryLabel ? (
              <Button href={c.finalCtaPrimaryHref} variant="secondary">
                {c.finalCtaPrimaryLabel}
              </Button>
            ) : null}
            {c.finalCtaSecondaryLabel ? <Button href={c.finalCtaSecondaryHref}>{c.finalCtaSecondaryLabel}</Button> : null}
          </>
        }
      />
    </>
  );
}
