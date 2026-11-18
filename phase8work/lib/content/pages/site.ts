import { area, buttonFields, link, repeatFields, text, toggle } from '../fields';
import type { PageDefinition } from '../types';

// Used by several pages (home, about, recruitment). Read with:
//   items(await getPageContent('site'), 'principle', 3, ['title', 'description'] as const)
export const siteSettings: PageDefinition = {
  slug: 'site',
  label: 'Site wide settings',
  path: '/',
  description: 'Header menu, footer, LinkedIn popup, and the cardinal principles shown on several pages.',
  sections: [
    {
      title: 'Header (top of every page)',
      description: 'The chapter name next to the logo, the menu, and the button on the right.',
      fields: [
        text('brandName', 'Name next to the logo', 'Phi Delta Theta'),
        text('brandChapter', 'Small line under the name', 'Connecticut Epsilon'),
        text('logoAlt', 'Logo description (for screen readers)', 'Phi Delta Theta Connecticut Epsilon home'),
        ...repeatFields(
          'nav',
          'Menu item',
          8,
          [
            { name: 'label', label: 'Text' },
            { name: 'href', label: 'Goes to', type: 'link' },
          ],
          [
            { label: 'Our Chapter', href: '/about' },
            { label: 'Brotherhood', href: '/brotherhood' },
            { label: 'Service', href: '/service' },
            { label: 'Recruitment', href: '/recruitment' },
            { label: 'Events', href: '/events' },
            { label: 'Alumni', href: '/alumni' },
          ],
        ),
        ...buttonFields('headerButton', 'Header button', { label: 'Get Involved', href: '/get-involved' }),
      ],
    },
    {
      title: 'Footer (bottom of every page)',
      fields: [
        area('footerTagline', 'Short description under the name', 'The chapter home for brothers, future members, alumni, families, and friends at Quinnipiac University.'),
        text('footerCol1Heading', 'Column 1 heading', 'Discover'),
        ...repeatFields(
          'footerCol1Link',
          'Column 1 link',
          6,
          [
            { name: 'label', label: 'Text' },
            { name: 'href', label: 'Goes to', type: 'link' },
          ],
          [
            { label: 'Our Chapter', href: '/about' },
            { label: 'Brotherhood', href: '/brotherhood' },
            { label: 'Service & Community', href: '/service' },
            { label: 'Recruitment', href: '/recruitment' },
          ],
        ),
        text('footerCol2Heading', 'Column 2 heading', 'Stay Connected'),
        ...repeatFields(
          'footerCol2Link',
          'Column 2 link',
          6,
          [
            { name: 'label', label: 'Text' },
            { name: 'href', label: 'Goes to', type: 'link' },
          ],
          [
            { label: 'Events', href: '/events' },
            { label: 'Chapter News', href: '/newsletter' },
            { label: 'Alumni Network', href: '/alumni' },
            { label: 'Mentorship', href: '/mentorship' },
            { label: 'Legacy Vault', href: '/legacy-vault' },
          ],
        ),
        text('footerCol3Heading', 'Column 3 heading', 'Take Part'),
        ...repeatFields(
          'footerCol3Link',
          'Column 3 link',
          6,
          [
            { name: 'label', label: 'Text' },
            { name: 'href', label: 'Goes to', type: 'link' },
          ],
          [
            { label: 'Get Involved', href: '/get-involved' },
            { label: 'Contact the Chapter', href: '/contact' },
            { label: 'Member Sign In', href: '/access' },
            { label: 'Quinnipiac University', href: 'https://www.qu.edu/' },
          ],
        ),
        text('footerCopyright', 'Copyright line (the year is added automatically)', 'Phi Delta Theta Connecticut Epsilon. Chapter website.'),
      ],
    },
    {
      title: 'Social links and contact',
      description: 'Shown in the footer only when filled in. Leave a box blank to hide it.',
      fields: [
        link('socialInstagram', 'Instagram page', '', 'Full address, like https://www.instagram.com/yourchapter'),
        link('socialLinkedin', 'LinkedIn page or group', 'https://www.linkedin.com/groups/34520012/', 'Full address, like https://www.linkedin.com/groups/...'),
        text('contactEmail', 'Chapter contact email', '', 'Shown as a clickable email link.'),
      ],
    },
    {
      title: 'LinkedIn popup (home page)',
      description: 'The small box in the bottom corner of the home page inviting alumni to the LinkedIn group. Visitors who close it will not see it again.',
      fields: [
        toggle('popupEnabled', 'Show the popup', true),
        text('popupTitle', 'Title', 'Join our LinkedIn alumni group'),
        area('popupText', 'Text', 'Connect with Connecticut Epsilon brothers and stay in the loop.'),
        text('popupButtonLabel', 'Button text', 'Join the Group'),
        link('popupUrl', 'Button goes to', 'https://www.linkedin.com/groups/34520012/'),
      ],
    },
    {
      title: 'Cardinal principles',
      description: 'Shown on the Home, About, and Recruitment pages.',
      fields: repeatFields(
        'principle',
        'Principle',
        3,
        [
          { name: 'title', label: 'Name' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ],
        [
          { title: 'Friendship', description: 'Build genuine relationships that begin on campus and continue through every season of life.' },
          { title: 'Sound Learning', description: 'Support academic growth, thoughtful leadership, and the confidence to keep learning beyond college.' },
          { title: 'Rectitude', description: 'Lead with integrity, responsibility, and service to the chapter, campus, and wider community.' },
        ],
      ),
    },
  ],
};
