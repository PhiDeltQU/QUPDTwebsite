import { area, buttonFields, headingFields, heroFields, image, repeatFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const recruitmentPage: PageDefinition = {
  slug: 'recruitment',
  label: 'Recruitment',
  path: '/recruitment',
  description: 'How to join the chapter.',
  sections: [
    {
      title: 'Top of page',
      fields: [
        ...heroFields('hero', {
          eyebrow: 'Recruitment',
          title: 'Find out if Connecticut Epsilon is right for you',
          description:
            'Phi Delta Theta at Quinnipiac University is looking for future members who want real friendship, leadership experience, and a chapter built on integrity.',
          image: '/images/chapter/formal-chapter.jpg',
          imageAlt: 'Phi Delta Theta Connecticut Epsilon brothers together on campus',
        }),
        ...buttonFields('heroPrimary', 'First button', { label: 'Ask a Question', href: '/contact' }),
        ...buttonFields('heroSecondary', 'Second button', { label: 'See Chapter Life', href: '/brotherhood' }),
      ],
    },
    {
      title: 'Motto banner',
      fields: [
        image('mottoImage', 'Graphic', '/brand/phi-delt-lockup.webp', 'Leave blank to hide this banner.'),
        text('mottoImageAlt', 'Graphic description (for screen readers)', 'Phi Delta Theta: Become the Greatest Version of Yourself'),
        area(
          'mottoCaption',
          'Caption under the graphic',
          'Becoming the greatest version of yourself is what membership in Connecticut Epsilon is about.',
          'Leave blank to hide.',
        ),
      ],
    },
    {
      title: 'What we look for (link cards)',
      fields: [
        ...headingFields('lookFor', {
          eyebrow: 'What We Look For',
          title: 'Membership built on real standards, not a stereotype',
          description: "Connecticut Epsilon is guided by Phi Delta Theta's three cardinal principles: Friendship, Sound Learning, and Rectitude.",
        }),
        ...repeatFields(
          'lookForCard',
          'Card',
          6,
          [
            { name: 'title', label: 'Title' },
            { name: 'eyebrow', label: 'Small label' },
            { name: 'description', label: 'Text', type: 'textarea' },
            { name: 'linkLabel', label: 'Link text' },
            { name: 'href', label: 'Link goes to', type: 'link' },
          ],
          [
            {
              eyebrow: 'Character',
              title: 'People who show up for others',
              description: 'We look for guys who are dependable, honest, and genuinely invested in the people around them.',
              href: '/brotherhood',
              linkLabel: 'See what brotherhood looks like',
            },
            {
              eyebrow: 'Ambition',
              title: 'A drive to grow',
              description: 'Membership is a place to build real leadership experience, not just a social label.',
              href: '/about',
              linkLabel: 'Learn about the chapter',
            },
            {
              eyebrow: 'Commitment',
              title: 'Willingness to contribute',
              description: 'Chapters are built by members who show up, take on responsibility, and support one another and the community.',
              href: '/service',
              linkLabel: 'See our service commitment',
            },
          ],
        ),
      ],
    },
    {
      title: 'Our values (photo and principles)',
      description: 'The principles listed here are edited under Site wide settings.',
      fields: [
        image('valuesImage', 'Photo', '/images/chapter/meet-the-brothers.jpg'),
        text('valuesImageAlt', 'Photo description (for screen readers)', 'Prospective members meeting Phi Delta Theta brothers'),
        text('valuesEyebrow', 'Small label', 'Our Values'),
        text('valuesTitle', 'Heading', 'The principles behind every bid we extend'),
      ],
    },
    {
      title: 'How recruitment works (steps)',
      fields: [
        ...headingFields('process', {
          eyebrow: 'The Process',
          title: 'How recruitment works',
          description: 'Every chapter runs recruitment a little differently. Here is what to expect at Connecticut Epsilon.',
        }),
        ...repeatFields(
          'step',
          'Step',
          8,
          [
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Text', type: 'textarea' },
          ],
          [
            { title: 'Meet the Brothers', description: 'Come to an open event, ask real questions, and get a feel for the chapter beyond a single conversation.' },
            {
              title: 'Attend Recruitment Events',
              description: "Follow the chapter and the campus fraternity and sorority life office for the current semester's recruitment schedule.",
            },
            { title: 'Receive a Bid', description: 'Chapter members vote to extend bids to prospective members who reflect our values and add to the chapter.' },
            { title: 'New Member Education', description: 'Learn chapter history, ritual, and expectations before being initiated as a full brother.' },
          ],
        ),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Take the First Step'),
        text('ctaTitle', 'Heading', 'Have questions about joining Connecticut Epsilon?'),
        area(
          'ctaDescription',
          'Text',
          "Reach out directly and a chapter officer will get back to you with recruitment details and the current semester's event schedule.",
        ),
        ...buttonFields('ctaPrimary', 'First button', { label: 'Contact the Chapter', href: '/contact' }),
        ...buttonFields('ctaSecondary', 'Second button', { label: 'View Events', href: '/events' }),
      ],
    },
  ],
};
