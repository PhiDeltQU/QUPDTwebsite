import { area, headingFields, heroFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const contactPage: PageDefinition = {
  slug: 'contact',
  label: 'Contact',
  path: '/contact',
  description: 'Contact form and its intro text.',
  sections: [
    {
      title: 'Top of page',
      fields: heroFields('hero', {
        eyebrow: 'Contact the Chapter',
        title: 'Get in touch with Connecticut Epsilon',
        description:
          'Questions about recruitment, alumni updates, event ideas, service partnerships, or stories for the archive all start here. A chapter officer will get back to you.',
      }),
    },
    {
      title: 'Contact form',
      fields: [
        ...headingFields('form', {
          title: 'Reach out to the chapter',
          description: 'Send a note about reconnecting, supporting the chapter, suggesting an event, or sharing a story.',
        }),
        text('formCardTitle', 'Form title', 'Send a message'),
        area('formCardDescription', 'Form description', 'Pick the topic that fits best so your message reaches the right officer.'),
        text('formSuccessMessage', 'Message shown after someone sends the form', "Your message was received. We'll be in touch soon."),
      ],
    },
  ],
};
