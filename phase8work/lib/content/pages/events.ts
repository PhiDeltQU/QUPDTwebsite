import { area, buttonFields, headingFields, heroFields, repeatFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const eventsPage: PageDefinition = {
  slug: 'events',
  label: 'Events',
  path: '/events',
  description: 'Text around the event calendar. Add or edit the events themselves in the Events tab.',
  sections: [
    {
      title: 'Top of page',
      fields: heroFields('hero', {
        eyebrow: 'Events',
        title: 'Where the chapter comes together',
        description:
          'From recruitment nights to formals, service days, and alumni gatherings, this is the calendar for everyone connected to Connecticut Epsilon.',
      }),
    },
    {
      title: 'Event lists',
      description: 'Headings above the lists of events. The events come from the Events tab.',
      fields: [
        text('eventsUpcomingTitle', 'Upcoming events heading', 'Upcoming events'),
        area('eventsUpcomingDescription', 'Upcoming events intro', 'Every event on the calendar, with full details.'),
        text('eventsEmptyMessage', 'Message when no upcoming events are scheduled', 'No upcoming events are scheduled yet. Check back soon.'),
        text('eventsPastTitle', 'Past events heading', 'Past events'),
        area('eventsPastDescription', 'Past events intro', 'A look back at recent chapter gatherings.'),
      ],
    },
    {
      title: 'Event types (cards)',
      fields: [
        ...headingFields('categories', {
          eyebrow: 'A Full Chapter Calendar',
          title: 'Events for every part of the Connecticut Epsilon community',
          description: 'Recruitment nights, brotherhood traditions, service days, and alumni gatherings all live on the same calendar.',
        }),
        ...repeatFields(
          'category',
          'Card',
          6,
          [
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Text', type: 'textarea' },
          ],
          [
            { title: 'Recruitment & Brotherhood', description: 'Rush events, socials, and the traditions that turn future members into brothers for life.' },
            { title: 'Service & Campus Life', description: "Community service days and campus partnerships that put the chapter's values into action." },
            { title: 'Alumni & Legacy', description: 'Founders Day, reunions, and gatherings that keep alumni connected to the chapter they helped build.' },
          ],
        ),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Have an idea?'),
        text('ctaTitle', 'Heading', "Help shape what's on the calendar"),
        area('ctaDescription', 'Text', 'Active brothers, alumni, and campus partners are all welcome to suggest an event or gathering for the chapter.'),
        ...buttonFields('ctaButton', 'Button', { label: 'Suggest an event', href: '/contact' }),
      ],
    },
  ],
};
