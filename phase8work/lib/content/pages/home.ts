import { area, buttonFields, headingFields, heroFields, image, repeatFields, text, toggle } from '../fields';
import type { PageDefinition } from '../types';

// Keys that existed before the editor (heroTitle, missionTitle, valuesTitle, ...) must keep their names:
// the live site_content table already has rows for them.
export const homePage: PageDefinition = {
  slug: 'home',
  label: 'Home',
  path: '/',
  description: 'The front page of the website.',
  sections: [
    {
      title: 'Top of page',
      fields: [
        ...heroFields('hero', {
          eyebrow: 'Phi Delta Theta Connecticut Epsilon',
          title: 'One chapter. Every generation. One home.',
          description:
            'The central home for chapter life at Quinnipiac University, connecting active brothers, future members, alumni, families, and friends.',
          image: '/images/chapter/chapter-on-campus.jpg',
          imageAlt: 'Members of Phi Delta Theta Connecticut Epsilon gathered on the Quinnipiac University campus',
        }),
        ...buttonFields('heroPrimary', 'First button', { label: 'Explore Recruitment', href: '/recruitment' }),
        ...buttonFields('heroSecondary', 'Second button', { label: 'Meet the Chapter', href: '/about' }),
        ...buttonFields('heroTertiary', 'Third button', { label: 'Member Sign In', href: '/access' }),
      ],
    },
    {
      title: 'Facts strip (dark bar under the top photo)',
      fields: repeatFields(
        'fact',
        'Fact',
        4,
        [
          { name: 'value', label: 'Big text' },
          { name: 'label', label: 'Small label' },
        ],
        [
          { label: 'Established', value: '2025' },
          { label: 'Home', value: 'Quinnipiac University' },
          { label: 'Chapter', value: 'Connecticut Epsilon' },
        ],
      ),
    },
    {
      title: 'Introduction (photo and story)',
      fields: [
        image('introImage', 'Photo', '/images/chapter/formal-chapter.jpg', 'Upload a new photo or paste an image link. Tall (portrait) photos work best here.'),
        text('introImageAlt', 'Photo description (for screen readers)', 'Phi Delta Theta Connecticut Epsilon chapter members in formal attire'),
        text('introEyebrow', 'Small label', 'This Is Connecticut Epsilon'),
        text('introTitle', 'Heading', 'A young chapter building something meant to last'),
        area(
          'introBody',
          'First paragraph',
          'Connecticut Epsilon is creating its traditions in real time. Every brother has the chance to shape the culture, take meaningful responsibility, and build a standard future classes can inherit.',
        ),
        area(
          'introBodySecondary',
          'Second paragraph',
          'Learn who we are, what we value, how to join, where we serve, what is coming up next, and how brothers stay connected after graduation.',
          'Leave blank to hide.',
        ),
        ...buttonFields('introPrimary', 'First button', { label: 'Our Story', href: '/about' }),
        ...buttonFields('introSecondary', 'Second button', { label: 'Chapter Life', href: '/brotherhood' }),
        text('introLocationTitle', 'Location box: bold line', 'Hamden, Connecticut', 'Leave blank to hide the location box.'),
        text('introLocationText', 'Location box: second line', 'Part of the Quinnipiac University community'),
      ],
    },
    {
      title: 'Find your path (link cards)',
      fields: [
        ...headingFields('mission', {
          eyebrow: 'Chapter Hub',
          title: 'Built for every stage of brotherhood',
          description:
            'Discover chapter life, explore recruitment, stay connected after graduation, and find meaningful ways to support Connecticut Epsilon.',
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
              eyebrow: 'Future Members',
              title: 'Find your place here',
              description: 'Meet the chapter, learn what membership asks of you, and see what it means to help shape a young fraternity at Quinnipiac.',
              href: '/recruitment',
              linkLabel: 'Explore recruitment',
            },
            {
              eyebrow: 'Chapter Life',
              title: 'Brotherhood in action',
              description: 'See how friendship, leadership, campus life, academics, and shared responsibility come together every day.',
              href: '/brotherhood',
              linkLabel: 'Discover brotherhood',
            },
            {
              eyebrow: 'Service',
              title: 'Leave something better',
              description: 'Learn how the chapter turns rectitude into service, campus participation, philanthropy, and community partnership.',
              href: '/service',
              linkLabel: 'See our impact',
            },
            {
              eyebrow: 'Alumni',
              title: 'Stay connected for life',
              description: 'Return to the alumni directory, mentorship network, chapter updates, events, and the Legacy Vault.',
              href: '/alumni',
              linkLabel: 'Open the alumni network',
            },
          ],
        ),
      ],
    },
    {
      title: 'Values',
      description: 'The three principle cards themselves are edited under Site wide settings.',
      fields: headingFields('values', {
        eyebrow: 'Values',
        title: 'The principles behind the chapter experience',
        description: 'Friendship, sound learning, and rectitude guide how Connecticut Epsilon learns, leads, serves, and grows together.',
      }),
    },
    {
      title: 'Photo stories',
      description: 'The first photo is shown larger than the others.',
      fields: [
        ...headingFields('spotlight', {
          eyebrow: 'Brotherhood in Action',
          title: 'A chapter experience that keeps growing',
          description: "The chapter brings today's brotherhood together with the alumni network and the members who will carry it forward.",
        }),
        ...repeatFields(
          'photo',
          'Photo',
          5,
          [
            { name: 'image', label: 'Photo', type: 'image' },
            { name: 'alt', label: 'Photo description (for screen readers)' },
            { name: 'label', label: 'Small label' },
            { name: 'title', label: 'Caption' },
          ],
          [
            {
              image: '/images/chapter/meet-the-brothers.jpg',
              alt: 'Phi Delta Theta brothers welcoming students at a campus table',
              label: 'Campus Life',
              title: 'Meet people where they are',
            },
            {
              image: '/images/chapter/brotherhood-on-the-quad.jpg',
              alt: 'Brothers enjoying a chapter event on the Quinnipiac quad',
              label: 'Brotherhood',
              title: 'Make room for the everyday moments',
            },
            {
              image: '/images/chapter/community-service.jpg',
              alt: 'Phi Delta Theta brothers visiting and supporting a member of the local community',
              label: 'Service',
              title: 'Show up beyond the chapter',
            },
          ],
        ),
      ],
    },
    {
      title: 'Upcoming events',
      description: 'The events themselves come from the Events tab in the admin menu.',
      fields: [
        ...headingFields('events', {
          eyebrow: 'Chapter Calendar',
          title: 'Come together on campus and beyond',
          description: 'Discover brotherhood, service, professional, and alumni events that keep the Connecticut Epsilon community connected.',
        }),
        ...buttonFields('eventsButton', 'Button', { label: 'View All Events', href: '/events' }),
        area('eventsEmpty', 'Message when no events are scheduled', 'New chapter events will be posted here as dates are announced.'),
      ],
    },
    {
      title: 'Chapter news',
      description: 'The newsletter issues themselves come from the Newsletters tab in the admin menu.',
      fields: [
        ...headingFields('newsletter', {
          eyebrow: 'Chapter News',
          title: 'Stay connected to what is happening now',
          description: 'Read chapter updates, event recaps, alumni stories, and opportunities to take part in what comes next.',
        }),
        ...buttonFields('newsletterButton', 'Button', { label: 'Read Chapter News', href: '/newsletter' }),
        area('newsletterEmpty', 'Message when nothing has been published', 'The first chapter update will be published here soon.'),
      ],
    },
    {
      title: 'Alumni spotlight',
      description: 'A featured spotlight from the database shows here automatically. These boxes are only used when none is featured.',
      fields: [
        toggle('spotlightFallbackShow', 'Show this box when no spotlight is featured', false),
        text('spotlightFallbackName', 'Name', 'Alumni Spotlight'),
        text('spotlightFallbackRole', 'Role or class year', 'Connecticut Epsilon Alumnus'),
        area('spotlightFallbackQuote', 'Quote', 'Phi Delt gave me friendships and a standard I still carry with me.'),
        area('spotlightFallbackStory', 'Story', 'Each semester the chapter features an alumnus and the path they have taken since Quinnipiac.'),
      ],
    },
    {
      title: 'Legacy Vault banner',
      fields: [
        ...headingFields('legacy', {
          eyebrow: 'Legacy Vault',
          title: 'Preserve the story as the chapter grows',
          description: 'Keep composite boards, photos, letters, milestone documents, and shared memories accessible to the generations that follow.',
        }),
        ...buttonFields('legacyButton', 'Button', { label: 'Contribute a Memory', href: '/legacy-vault' }),
        image('legacyImage', 'Photo', '/images/chapter/chapter-showcase.jpg'),
        text('legacyImageAlt', 'Photo description (for screen readers)', 'Connecticut Epsilon brothers gathered at a Greek life showcase'),
      ],
    },
    {
      title: 'Bottom banner',
      fields: [
        text('finalCtaEyebrow', 'Small label', 'Your Next Step'),
        text('finalCtaTitle', 'Heading', 'Find your place in Connecticut Epsilon'),
        area(
          'finalCtaDescription',
          'Text',
          'Explore recruitment, attend an event, reconnect through the alumni network, or support the chapter with your time and experience.',
        ),
        ...buttonFields('finalCtaPrimary', 'First button', { label: 'Explore Membership', href: '/recruitment' }),
        ...buttonFields('finalCtaSecondary', 'Second button', { label: 'Get Involved', href: '/get-involved' }),
      ],
    },
  ],
};
