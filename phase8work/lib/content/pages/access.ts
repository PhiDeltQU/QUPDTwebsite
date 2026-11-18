import { headingFields, heroFields, repeatFields } from '../fields';
import type { PageDefinition } from '../types';

export const accessPage: PageDefinition = {
  slug: 'access',
  label: 'Member Sign In',
  path: '/access',
  description: 'The page that sends people to the active member, alumni, or admin sign in.',
  sections: [
    {
      title: 'Top of page',
      fields: heroFields('hero', {
        eyebrow: 'Member Access',
        title: 'Choose the space that belongs to you',
        description: 'Connecticut Epsilon uses separate sign in paths for active members, alumni, and chapter officers.',
      }),
    },
    {
      title: 'Sign in cards',
      fields: [
        ...headingFields('portals', {
          title: 'Select your portal',
          description: 'If you have not claimed your account yet, use the setup option on the matching sign in page.',
        }),
        ...repeatFields(
          'portal',
          'Card',
          4,
          [
            { name: 'title', label: 'Title' },
            { name: 'eyebrow', label: 'Small label' },
            { name: 'description', label: 'Text', type: 'textarea' },
            { name: 'linkLabel', label: 'Link text' },
            { name: 'href', label: 'Link goes to', type: 'link' },
          ],
          [
            {
              eyebrow: 'Current Chapter',
              title: 'Active Member Sign In',
              description: 'Access active member resources, applications, opportunities, and chapter tools.',
              href: '/active/login',
              linkLabel: 'Continue as an active member',
            },
            {
              eyebrow: 'After Graduation',
              title: 'Alumni Sign In',
              description: 'Access the alumni portal, profile tools, directory, mentorship, and chapter network.',
              href: '/member/login',
              linkLabel: 'Continue as an alumnus',
            },
            {
              eyebrow: 'Chapter Leadership',
              title: 'Officer & Admin Sign In',
              description: 'Manage chapter content, records, newsletters, events, and submissions.',
              href: '/admin/login',
              linkLabel: 'Continue as an administrator',
            },
          ],
        ),
      ],
    },
  ],
};
