import { area, buttonFields, headingFields, heroFields, repeatFields, text } from '../fields';
import type { PageDefinition } from '../types';

// Keys that existed before the editor (heroTitle, overviewBody, themeOneTitle, ...) must keep their names:
// the live site_content table already has rows for them.
export const aboutPage: PageDefinition = {
  slug: 'about',
  label: 'Our Chapter (About)',
  path: '/about',
  description: 'Chapter story, principles, character, and timeline.',
  sections: [
    {
      title: 'Top of page',
      fields: [
        ...heroFields('hero', {
          eyebrow: 'Our Chapter',
          title: 'Building the Connecticut Epsilon story together',
          description:
            'Founded at Quinnipiac University, Connecticut Epsilon is creating a chapter culture centered on friendship, learning, integrity, leadership, and service.',
          image: '/images/chapter/chapter-showcase.jpg',
          imageAlt: 'Phi Delta Theta Connecticut Epsilon brothers gathered at a campus showcase',
        }),
        ...buttonFields('heroPrimary', 'First button', { label: 'Explore Recruitment', href: '/recruitment' }),
        ...buttonFields('heroSecondary', 'Second button', { label: 'Contact the Chapter', href: '/contact' }),
      ],
    },
    {
      title: 'Chapter overview',
      fields: [
        text('overviewTitle', 'Heading', 'A young chapter with a long view'),
        area(
          'overviewDescription',
          'Intro paragraph',
          'The chapter is building traditions today with the intention that they will strengthen brothers and connect generations for decades to come.',
        ),
        area(
          'overviewBody',
          'Story: first paragraph',
          'Connecticut Epsilon gives members a place to form close friendships, take on meaningful responsibility, contribute to campus life, and grow into principled leaders.',
        ),
        area(
          'overviewBodySecondary',
          'Story: second paragraph',
          'Brothers are building the chapter one semester at a time through recruitment, service, campus involvement, and a growing alumni network.',
          'Leave blank to hide.',
        ),
      ],
    },
    {
      title: 'At a glance (dark box)',
      fields: [
        text('glanceHeading', 'Small label', 'At a Glance'),
        ...repeatFields(
          'glance',
          'Fact',
          5,
          [
            { name: 'value', label: 'Big text' },
            { name: 'label', label: 'Small label' },
          ],
          [
            { label: 'Campus', value: 'Quinnipiac University' },
            { label: 'Chapter', value: 'Connecticut Epsilon' },
            { label: 'Established', value: '2025' },
          ],
        ),
      ],
    },
    {
      title: 'Cardinal principles',
      description: 'The three principle cards themselves are edited under Site wide settings.',
      fields: headingFields('principles', {
        eyebrow: 'Our Cardinal Principles',
        title: 'Three values, practiced every day',
        description: 'These principles give the chapter a common standard for relationships, learning, leadership, and service.',
      }),
    },
    {
      title: 'Chapter character (numbered cards)',
      fields: [
        text('themesEyebrow', 'Small label', 'Chapter Character'),
        text('themesTitle', 'Heading', 'What defines the chapter'),
        area('themesDescription', 'Intro paragraph', 'The chapter experience is shaped by what brothers choose to practice together.'),
        text('themeOneTitle', 'Card 1: Title', 'Brotherhood', 'Leave blank to hide card 1.'),
        area('themeOneDescription', 'Card 1: Text', 'A culture of trust, accountability, shared experience, and lifelong friendship.'),
        text('themeTwoTitle', 'Card 2: Title', 'Growth', 'Leave blank to hide card 2.'),
        area('themeTwoDescription', 'Card 2: Text', 'Academic, personal, and leadership development shaped by real responsibility and support.'),
        text('themeThreeTitle', 'Card 3: Title', 'Service', 'Leave blank to hide card 3.'),
        area('themeThreeDescription', 'Card 3: Text', 'A commitment to leave the chapter, campus, and surrounding community stronger than we found them.'),
      ],
    },
    {
      title: 'Timeline',
      description: 'Add a new milestone in the next empty slot. They show in order, left to right.',
      fields: [
        text('timelineEyebrow', 'Small label', 'Our Story'),
        text('timelineTitle', 'Heading', 'A foundation future generations can build on'),
        area(
          'timelineDescription',
          'Intro paragraph',
          'Connecticut Epsilon is still writing its earliest chapters. This timeline will grow alongside the milestones, traditions, and brothers who shape it.',
        ),
        ...repeatFields(
          'timelineItem',
          'Milestone',
          8,
          [
            { name: 'year', label: 'Year (or a word like Today)' },
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Text', type: 'textarea' },
          ],
          [
            {
              year: '2025',
              title: 'Chapter Founded',
              description: 'Connecticut Epsilon begins building a Phi Delta Theta experience rooted in friendship, sound learning, and rectitude.',
            },
            {
              year: 'Today',
              title: 'Building the Foundation',
              description: 'Active brothers are establishing the traditions, service programs, and leadership culture that will define the chapter.',
            },
            {
              year: 'Next',
              title: 'Growing Across Generations',
              description: 'Future members, active brothers, and alumni stay connected as the chapter grows.',
            },
          ],
        ),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('ctaEyebrow', 'Small label', 'Keep Exploring'),
        text('ctaTitle', 'Heading', 'See what the chapter looks like in action'),
        area('ctaDescription', 'Text', 'Explore the brotherhood experience, learn how Connecticut Epsilon serves, or start a conversation about membership.'),
        ...buttonFields('ctaPrimary', 'First button', { label: 'Brotherhood', href: '/brotherhood' }),
        ...buttonFields('ctaSecondary', 'Second button', { label: 'Service', href: '/service' }),
      ],
    },
  ],
};

