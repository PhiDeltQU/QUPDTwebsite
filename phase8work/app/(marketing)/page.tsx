import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/sections/section-shell';
import { values } from '@/lib/constants/site';
import { ValueCard } from '@/components/cards/value-card';
import { EventCard } from '@/components/cards/event-card';
import { NewsletterCard } from '@/components/cards/newsletter-card';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Container } from '@/components/layout/container';
import { CTASection } from '@/components/sections/cta-section';
import { getHomePageContent } from '@/lib/queries/content';
import { getEvents, getNewsletters } from '@/lib/queries/public';

const chapterPathways = [
  {
    eyebrow: 'Future Members',
    title: 'Find your place here',
    description: 'Meet the chapter, learn what membership asks of you, and see what it means to help shape a young fraternity at Quinnipiac.',
    href: '/recruitment',
    linkLabel: 'Explore recruitment',
  },
  {
    eyebrow: 'Chapter Life',
    title: 'Brotherhood in action',
    description: 'See how friendship, leadership, campus life, academics, and shared responsibility come together every day.',
    href: '/brotherhood',
    linkLabel: 'Discover brotherhood',
  },
  {
    eyebrow: 'Service',
    title: 'Leave something better',
    description: 'Learn how the chapter turns rectitude into service, campus participation, philanthropy, and community partnership.',
    href: '/service',
    linkLabel: 'See our impact',
  },
  {
    eyebrow: 'Alumni',
    title: 'Stay connected for life',
    description: 'Return to the protected alumni directory, mentorship network, chapter updates, events, and legacy tools.',
    href: '/alumni',
    linkLabel: 'Open the alumni network',
  },
] as const;

const photoStories = [
  {
    src: '/images/chapter/meet-the-brothers.jpg',
    alt: 'Phi Delta Theta brothers welcoming students at a campus table',
    label: 'Campus Life',
    title: 'Meet people where they are',
    className: 'md:row-span-2',
  },
  {
    src: '/images/chapter/brotherhood-on-the-quad.jpg',
    alt: 'Brothers enjoying a chapter event on the Quinnipiac quad',
    label: 'Brotherhood',
    title: 'Make room for the everyday moments',
    className: '',
  },
  {
    src: '/images/chapter/community-service.jpg',
    alt: 'Phi Delta Theta brothers visiting and supporting a member of the local community',
    label: 'Service',
    title: 'Show up beyond the chapter',
    className: '',
  },
] as const;

export default async function HomePage() {
  const [content, allEvents, allNewsletters] = await Promise.all([
    getHomePageContent(),
    getEvents(),
    getNewsletters(),
  ]);

  const featuredEvents = allEvents.slice(0, 3);
  const recentNewsletters = allNewsletters.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image="/images/chapter/chapter-on-campus.jpg"
        imageAlt="Members of Phi Delta Theta Connecticut Epsilon gathered on the Quinnipiac University campus"
        imagePosition="center 58%"
        actions={
          <>
            <Button href="/recruitment">Explore Recruitment</Button>
            <Button href="/about" variant="secondary">Meet the Chapter</Button>
            <Button href="/access" variant="ghost">Member Sign In</Button>
          </>
        }
      />

      <section className="border-b border-black/5 bg-fraternity-charcoal py-5 text-white">
        <Container className="grid gap-5 sm:grid-cols-3 sm:divide-x sm:divide-white/15">
          <div className="px-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">Established</p>
            <p className="mt-1 font-serif text-xl text-white">2025</p>
          </div>
          <div className="px-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">Home</p>
            <p className="mt-1 font-serif text-xl text-white">Quinnipiac University</p>
          </div>
          <div className="px-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">Chapter</p>
            <p className="mt-1 font-serif text-xl text-white">Connecticut Epsilon</p>
          </div>
        </Container>
      </section>

      <section className="section-padding">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="image-frame aspect-[4/5] min-h-[30rem]">
            <Image
              src="/images/chapter/formal-chapter.jpg"
              alt="Phi Delta Theta Connecticut Epsilon chapter members in formal attire"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">This Is Connecticut Epsilon</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">A young chapter building something meant to last</h2>
            <p className="mt-6 text-lg">
              Connecticut Epsilon is creating its traditions in real time. Every brother has the chance to shape the culture, take meaningful responsibility, and build a standard future classes can inherit.
            </p>
            <p className="mt-4">
              This website brings that whole story together: who we are, what we value, how to join, where we serve, what is happening next, and how brothers stay connected after graduation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/about">Our Story</Button>
              <Button href="/brotherhood" variant="secondary">Chapter Life</Button>
            </div>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fraternity-azure/10 text-fraternity-azure">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm"><span className="font-semibold text-fraternity-charcoal">North Haven, Connecticut</span><br />Part of the Quinnipiac University community</p>
            </div>
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow={content.missionEyebrow}
        title={content.missionTitle}
        description={content.missionDescription}
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {chapterPathways.map((pathway) => (
            <PathwayCard key={pathway.title} {...pathway} />
          ))}
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-3xl">
            <p className="eyebrow">{content.valuesEyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-4xl">{content.valuesTitle}</h2>
            <p className="mt-4 max-w-2xl text-lg">{content.valuesDescription}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <ValueCard key={value.title} title={value.title} description={value.description} />
            ))}
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow={content.spotlightEyebrow}
        title={content.spotlightTitle}
        description={content.spotlightDescription}
      >
        <div className="grid auto-rows-[18rem] gap-5 md:grid-cols-2">
          {photoStories.map((story) => (
            <article key={story.src} className={`group image-frame ${story.className}`}>
              <Image
                src={story.src}
                alt={story.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">{story.label}</p>
                <h3 className="mt-2 text-2xl text-white">{story.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <Container>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">{content.eventsEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{content.eventsTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{content.eventsDescription}</p>
            </div>
            <Button href="/events" variant="secondary">View All Events</Button>
          </div>
          {featuredEvents.length ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <div className="surface mt-10 p-8">
              <p>New chapter events will be posted here as dates are announced.</p>
            </div>
          )}
        </Container>
      </section>

      <SectionShell
        eyebrow={content.newsletterEyebrow}
        title={content.newsletterTitle}
        description={content.newsletterDescription}
      >
        {recentNewsletters.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {recentNewsletters.map((issue) => (
              <NewsletterCard key={issue.slug} issue={issue} />
            ))}
          </div>
        ) : (
          <div className="surface p-8"><p>The first chapter update will be published here soon.</p></div>
        )}
        <div className="mt-8">
          <Button href="/newsletter" variant="secondary">Read Chapter News</Button>
        </div>
      </SectionShell>

      <section className="section-padding pt-0">
        <Container>
          <div className="surface grid overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 md:p-12">
              <p className="eyebrow">{content.legacyEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{content.legacyTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{content.legacyDescription}</p>
              <Button href="/legacy-vault" className="mt-7">Contribute a Memory <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>
            </div>
            <div className="relative min-h-[20rem]">
              <Image
                src="/images/chapter/chapter-showcase.jpg"
                alt="Connecticut Epsilon brothers gathered at a Greek life showcase"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow={content.finalCtaEyebrow}
        title={content.finalCtaTitle}
        description={content.finalCtaDescription}
        actions={
          <>
            <Button href="/recruitment" variant="secondary">Explore Membership</Button>
            <Button href="/get-involved">Get Involved</Button>
          </>
        }
      />
    </>
  );
}
