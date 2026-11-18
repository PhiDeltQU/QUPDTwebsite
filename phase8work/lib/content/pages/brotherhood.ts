import { area, buttonFields, headingFields, heroFields, image, repeatFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const brotherhoodPage: PageDefinition = {
  slug: 'brotherhood',
  label: 'Brotherhood',
  path: '/brotherhood',
  description: 'Chapter life, leadership, and lifelong friendship.',
  sections: [
    {
      title: 'Top of page',
      fields: [
        ...heroFields('hero', {
          eyebrow: 'Brotherhood',
          title: 'A chapter experience built through shared effort',
          description: 'Connecticut Epsilon is where friendship, accountability, leadership, service, and ambition become part of the same experience.',
          image: '/images/chapter/brotherhood-event.jpg',
          imageAlt: 'Phi Delta Theta brothers gathered at a chapter brotherhood event',
        }),
        ...buttonFields('heroPrimary', 'First button', { label: 'Explore Recruitment', href: '/recruitment' }),
        ...buttonFields('heroSecondary', 'Second button', { label: 'Member Sign In', href: '/access' }),
      ],
    },
    {
      title: 'The experience (link cards)',
      fields: [
        ...headingFields('pathways', {
          eyebrow: 'The Experience',
          title: 'Brotherhood is something members build together',
          description:
            'The strongest chapter experience comes from showing up for one another, taking responsibility, and creating traditions worth carrying forward.',
        }),
        ...repeatFields(
          'pathway',
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
              eyebrow: 'Shared Experience',
              title: 'Belong to something real',
              description: 'Build friendships through the everyday moments, traditions, and responsibilities that turn members into brothers.',
              href: '/events',
              linkLabel: 'See chapter events',
            },
            {
              eyebrow: 'Responsibility',
              title: 'Learn by leading',
              description: 'Own meaningful work, lead peers, solve problems, and build habits that carry into campus, career, and community life.',
              href: '/recruitment',
              linkLabel: 'Explore membership',
            },
            {
              eyebrow: 'For Life',
              title: 'Keep the connection going',
              description: 'Stay part of a network built through mentorship, career opportunities, chapter traditions, and lifelong friendship.',
              href: '/alumni',
              linkLabel: 'Open the alumni network',
            },
          ],
        ),
      ],
    },
    {
      title: 'More than meetings (photo and story)',
      fields: [
        image('storyImage', 'Photo', '/images/chapter/campus-community.jpg'),
        text('storyImageAlt', 'Photo description (for screen readers)', 'Phi Delta Theta brothers participating with the wider Quinnipiac campus community'),
        text('storyEyebrow', 'Small label', 'More Than Meetings'),
        text('storyTitle', 'Heading', 'A fuller way to experience college'),
        area(
          'storyBody',
          'First paragraph',
          'Chapter life creates reasons to connect across campus through friendship, competition, collaboration, service, and the work of building something together.',
        ),
        area(
          'storyBodySecondary',
          'Second paragraph',
          'The goal is not to make every brother the same. It is to give different people a shared standard, a dependable community, and room to become more capable versions of themselves.',
          'Leave blank to hide.',
        ),
        ...buttonFields('storyButton', 'Button', { label: "See What's Happening", href: '/events' }),
      ],
    },
    {
      title: 'How members grow (cards)',
      fields: [
        ...headingFields('growth', {
          eyebrow: 'How Members Grow',
          title: 'A chapter experience with more than one dimension',
          description: 'Brotherhood supports the whole person: on campus, in the classroom, in leadership, and in life after Quinnipiac.',
        }),
        ...repeatFields(
          'growthCard',
          'Card',
          8,
          [
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Text', type: 'textarea' },
          ],
          [
            { title: 'Sound Learning', description: 'Encourage strong academic habits, curiosity, and the confidence to keep learning from one another.' },
            { title: 'Leadership', description: 'Build practical experience through chapter roles, event planning, communication, and shared accountability.' },
            { title: 'Service', description: 'Put rectitude into practice by showing up for campus partners and the wider community.' },
            { title: 'Community', description: 'Create friendships and traditions that make college richer and remain meaningful after graduation.' },
          ],
        ),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Start Here'),
        text('ctaTitle', 'Heading', 'See whether Connecticut Epsilon is the right fit'),
        area('ctaDescription', 'Text', 'Meet the brothers, ask honest questions, and learn what membership could add to your Quinnipiac experience.'),
        ...buttonFields('ctaPrimary', 'First button', { label: 'Recruitment', href: '/recruitment' }),
        ...buttonFields('ctaSecondary', 'Second button', { label: 'Contact the Chapter', href: '/contact' }),
      ],
    },
  ],
};
