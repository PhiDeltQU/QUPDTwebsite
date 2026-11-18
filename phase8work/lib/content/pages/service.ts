import { area, buttonFields, headingFields, heroFields, image, repeatFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const servicePage: PageDefinition = {
  slug: 'service',
  label: 'Service',
  path: '/service',
  description: 'Philanthropy and community service.',
  sections: [
    {
      title: 'Top of page',
      fields: [
        ...heroFields('hero', {
          eyebrow: 'Service',
          title: 'Living rectitude through action',
          description:
            "Service is one of the ways Connecticut Epsilon puts its cardinal principles into practice, both through Phi Delta Theta's national philanthropy and local community work.",
          image: '/images/chapter/community-service.jpg',
          imageAlt: 'Phi Delta Theta Connecticut Epsilon brothers volunteering in the community',
        }),
        ...buttonFields('heroPrimary', 'First button', { label: 'Partner With Us', href: '/contact' }),
        ...buttonFields('heroSecondary', 'Second button', { label: 'See Chapter Life', href: '/brotherhood' }),
      ],
    },
    {
      title: 'How we serve (link cards)',
      fields: [
        ...headingFields('pillars', {
          eyebrow: 'How We Serve',
          title: 'National philanthropy, local commitment',
          description:
            'Service happens at two levels: the cause Phi Delta Theta stands behind nationally, and the work Connecticut Epsilon does closer to home.',
        }),
        ...repeatFields(
          'pillar',
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
              eyebrow: 'National Partnership',
              title: 'Live Like Lou',
              description:
                'Phi Delta Theta partners nationally with the ALS Association in honor of Lou Gehrig, a Phi Delt brother, supporting research and families affected by ALS.',
              href: 'https://www.phideltatheta.org/',
              linkLabel: 'Learn about Live Like Lou',
            },
            {
              eyebrow: 'On Campus',
              title: 'Serving the Quinnipiac community',
              description: 'Chapter service projects with campus partners and student organizations across Quinnipiac and Hamden.',
              href: '/contact',
              linkLabel: 'Ask about current projects',
            },
            {
              eyebrow: 'Get Involved',
              title: 'Partner with the chapter',
              description: 'Local organizations and alumni looking to propose a service opportunity can reach the chapter directly.',
              href: '/contact',
              linkLabel: 'Propose an opportunity',
            },
          ],
        ),
      ],
    },
    {
      title: 'Why it matters (photo and story)',
      fields: [
        image('storyImage', 'Photo', '/images/chapter/brotherhood-on-the-quad.jpg'),
        text('storyImageAlt', 'Photo description (for screen readers)', 'Phi Delta Theta brothers on the Quinnipiac quad'),
        text('storyEyebrow', 'Small label', 'Why It Matters'),
        text('storyTitle', 'Heading', 'Rectitude means more than a word in our creed'),
        area(
          'storyBody',
          'First paragraph',
          "Phi Delta Theta's third cardinal principle, Rectitude, asks brothers to act with integrity and leave every community they touch better than they found it.",
        ),
        area(
          'storyBodySecondary',
          'Second paragraph',
          'As a young chapter, Connecticut Epsilon is building its local service program one partnership at a time, from campus drives to volunteer days in Hamden.',
          'Leave blank to hide.',
        ),
        ...buttonFields('storyButton', 'Button', { label: 'Suggest a Service Partnership', href: '/contact' }),
      ],
    },
    {
      title: 'Service in action (cards)',
      fields: [
        ...headingFields('action', { eyebrow: 'Service in Action', title: 'What service looks like at Connecticut Epsilon' }),
        ...repeatFields(
          'actionCard',
          'Card',
          6,
          [
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Text', type: 'textarea' },
          ],
          [
            { title: 'ALS Awareness', description: "Supporting Phi Delta Theta's national Live Like Lou campaign through fundraising and awareness events." },
            { title: 'Campus Partnerships', description: 'Working alongside Quinnipiac student organizations on shared service and community building efforts.' },
            { title: 'Local Volunteering', description: 'Building an ongoing volunteer program in Hamden and the greater Quinnipiac community.' },
          ],
        ),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Work With Us'),
        text('ctaTitle', 'Heading', 'Know a cause Connecticut Epsilon should support?'),
        area('ctaDescription', 'Text', 'Alumni, campus partners, and local organizations are welcome to reach out about service opportunities and partnerships.'),
        ...buttonFields('ctaButton', 'Button', { label: 'Contact the Chapter', href: '/contact' }),
      ],
    },
  ],
};
