import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getEvents, getPastEvents, getUpcomingEvents } from '@/lib/queries/public';
import { EventCard } from '@/components/cards/event-card';
import { EventsCalendar } from '@/components/sections/events-calendar';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const revalidate = 300;

export default async function EventsPage() {
  const [allEvents, upcoming, past, c] = await Promise.all([getEvents(), getUpcomingEvents(), getPastEvents(), getPageContent('events')]);
  const categories = items(c, 'category', 6, ['title', 'description'] as const);

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} description={c.heroDescription} />
      <section className="section-padding pb-0">
        <EventsCalendar events={allEvents} />
      </section>

      <SectionShell title={c.eventsUpcomingTitle} description={c.eventsUpcomingDescription}>
        {upcoming.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">{c.eventsEmptyMessage}</p>
          </div>
        )}
      </SectionShell>

      {past.length ? (
        <SectionShell title={c.eventsPastTitle} description={c.eventsPastDescription}>
          <div className="grid gap-6 opacity-80 lg:grid-cols-3">
            {past.slice(0, 6).map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      {categories.length ? (
        <SectionShell eyebrow={c.categoriesEyebrow} title={c.categoriesTitle} description={c.categoriesDescription}>
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category) => (
              <div key={category.title} className="surface p-6">
                <h3 className="text-2xl">{category.title}</h3>
                <p className="mt-4">{category.description}</p>
              </div>
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
