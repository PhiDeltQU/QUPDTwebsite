import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getEvents } from '@/lib/queries/public';
import { EventCard } from '@/components/cards/event-card';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';

export default async function EventsPage() {
  const allEvents = await getEvents();
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where the chapter comes together"
        description="From recruitment nights to formals, service days, and alumni gatherings — this is the calendar for everyone connected to Connecticut Epsilon."
      />
      <SectionShell title="Featured this season" description="Lead with one flagship gathering and support it with the broader annual rhythm of chapter events.">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr_1fr]">
          {allEvents.map((event, index) => (
            <div key={event.slug} className={index === 0 ? 'lg:col-span-1' : ''}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </SectionShell>
      <SectionShell eyebrow="A Full Chapter Calendar" title="Events for every part of the Connecticut Epsilon community" description="Recruitment nights, brotherhood traditions, service days, and alumni gatherings all live on the same calendar.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Recruitment & Brotherhood', 'Rush events, socials, and the traditions that turn future members into brothers for life.'],
            ['Service & Campus Life', 'Community service days and campus partnerships that put the chapter’s values into action.'],
            ['Alumni & Legacy', 'Founders Day, reunions, and gatherings that keep alumni connected to the chapter they helped build.']
          ].map(([title, copy]) => (
            <div key={title} className="surface p-6">
              <h3 className="text-2xl">{title}</h3>
              <p className="mt-4">{copy}</p>
            </div>
          ))}
        </div>
      </SectionShell>
      <CTASection
        eyebrow="Have an idea?"
        title="Help shape what's on the calendar"
        description="Active brothers, alumni, and campus partners are all welcome to suggest an event or gathering for the chapter."
        actions={<Button href="/contact" variant="secondary">Suggest an event</Button>}
      />
    </>
  );
}
