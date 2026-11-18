import { area, buttonFields, headingFields, heroFields, repeatFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const getInvolvedPage: PageDefinition = {
  slug: 'get-involved',
  label: 'Get Involved',
  path: '/get-involved',
  description: 'Ways to attend, mentor, and support the chapter.',
  sections: [
    {
      title: 'Top of page',
      fields: [
        ...heroFields('hero', {
          eyebrow: 'Get Involved',
          title: 'There is more than one way to strengthen the chapter',
          description:
            'Give time, share experience, attend an event, preserve a memory, or simply stay connected to what Connecticut Epsilon is building.',
        }),
        ...buttonFields('heroPrimary', 'First button', { label: 'View Events', href: '/events' }),
        ...buttonFields('heroSecondary', 'Second button', { label: 'Contact the Chapter', href: '/contact' }),
      ],
    },
    {
      title: 'Ways to get involved (link cards)',
      fields: [
        ...headingFields('options', {
          eyebrow: 'Choose a Path',
          title: 'Start with the kind of involvement that fits',
          description: 'A strong chapter community makes room for active brothers, alumni, families, friends, mentors, and campus partners.',
        }),
        ...repeatFields(
          'option',
          'Card',
          9,
          [
            { name: 'title', label: 'Title' },
            { name: 'eyebrow', label: 'Small label' },
            { name: 'description', label: 'Text', type: 'textarea' },
            { name: 'linkLabel', label: 'Link text' },
            { name: 'href', label: 'Link goes to', type: 'link' },
          ],
          [
            {
              eyebrow: 'Attend',
              title: 'Join a chapter event',
              description: 'Find upcoming gatherings for active brothers, alumni, families, and friends of Connecticut Epsilon.',
              href: '/events',
              linkLabel: 'View events',
            },
            {
              eyebrow: 'Mentor',
              title: 'Share experience and opportunity',
              description: 'Support active brothers through career conversations, mentorship, introductions, internships, and practical advice.',
              href: '/mentorship',
              linkLabel: 'Explore mentorship',
            },
            {
              eyebrow: 'Stay Informed',
              title: 'Follow chapter news',
              description: 'Read the latest chapter updates and join the newsletter list for future communications.',
              href: '/newsletter',
              linkLabel: 'Read chapter news',
            },
            {
              eyebrow: 'Preserve',
              title: 'Contribute to the Legacy Vault',
              description: 'Help document chapter milestones, photos, letters, memories, and traditions for the brothers who follow.',
              href: '/legacy-vault',
              linkLabel: 'Open the Legacy Vault',
            },
            {
              eyebrow: 'Reconnect',
              title: 'Return to the alumni network',
              description: 'Sign in to the alumni directory to find brothers, update your profile, and stay connected beyond graduation.',
              href: '/alumni',
              linkLabel: 'Open the alumni network',
            },
            {
              eyebrow: 'Reach Out',
              title: 'Start a conversation',
              description: 'Offer an idea, ask a question, propose a partnership, or tell the chapter how you would like to help.',
              href: '/contact',
              linkLabel: 'Contact the chapter',
            },
          ],
        ),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Not Sure Where to Start?'),
        text('ctaTitle', 'Heading', 'Tell us how you would like to connect'),
        area(
          'ctaDescription',
          'Text',
          'The chapter can help route your interest to recruitment, alumni engagement, events, mentorship, communications, or another officer.',
        ),
        ...buttonFields('ctaButton', 'Button', { label: 'Send a Message', href: '/contact' }),
      ],
    },
  ],
};
