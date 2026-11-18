import { area, buttonFields, headingFields, heroFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const legacyVaultPage: PageDefinition = {
  slug: 'legacy-vault',
  label: 'Legacy Vault',
  path: '/legacy-vault',
  description: 'Archive intro text. Archive items come from the Media and Legacy Review tabs.',
  sections: [
    {
      title: 'Top of page',
      fields: heroFields('hero', {
        eyebrow: 'Legacy Vault',
        title: 'Preserve the chapter memory with dignity and depth',
        description:
          "A growing archive of photos, documents, and stories that capture Connecticut Epsilon's history, contributed by the brothers who lived it.",
      }),
    },
    {
      title: 'Archive',
      fields: [
        ...headingFields('archive', {
          title: 'From the archive',
          description: 'Every entry has a title, type, era, and description contributed by a member or alumnus.',
        }),
        text('archiveEmptyMessage', 'Message when the archive is empty', 'The first archive entries will be added here soon.'),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Contribute to the archive'),
        text('ctaTitle', 'Heading', 'Share a memory for the chapter archive'),
        area('ctaDescription', 'Text', 'Active members and alumni can submit photos, stories, and artifacts for the chapter to review and preserve.'),
        ...buttonFields('ctaButton', 'Button', { label: 'Submit a memory or artifact', href: '/legacy-vault/submit' }),
      ],
    },
  ],
};
