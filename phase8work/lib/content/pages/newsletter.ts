import { area, headingFields, heroFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const newsletterPage: PageDefinition = {
  slug: 'newsletter',
  label: 'Newsletter',
  path: '/newsletter',
  description: 'Signup form text and archive headings. Write and send issues in the Newsletters tab.',
  sections: [
    {
      title: 'Top of page',
      fields: heroFields('hero', {
        eyebrow: 'Newsletter & Communication',
        title: 'Stay connected to chapter news',
        description: 'Sign up to hear from Connecticut Epsilon directly, and catch up on past updates in the archive below.',
      }),
    },
    {
      title: 'Signup form',
      fields: [
        ...headingFields('signup', {
          title: 'Newsletter signup',
          description: 'Get chapter updates, event recaps, and alumni news sent directly to your inbox.',
        }),
        text('signupFormTitle', 'Form title', 'Join the Alumni Newsletter'),
        area('signupFormDescription', 'Form description', 'Sign up to receive chapter updates, event recaps, and alumni news.'),
        text('signupButtonLabel', 'Button text', 'Join the list'),
        text('signupSuccessMessage', 'Message shown after signing up', "Thanks for subscribing. You'll get the next chapter update."),
      ],
    },
    {
      title: 'Archive',
      fields: [
        ...headingFields('archive', {
          eyebrow: 'Archive',
          title: 'Recent issues',
          description: "Chapter updates and letters, archived here as they're published.",
        }),
        text('archiveEmptyMessage', 'Message when no issues are published yet', 'The first chapter newsletter will be published here soon.'),
      ],
    },
  ],
};
