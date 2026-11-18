import { AlumniProfile, EventItem, LegacyVaultItem, NavItem, NewsletterIssue, Spotlight } from '@/types';

export const siteConfig = {
  name: 'Phi Delta Theta',
  chapter: 'Connecticut Epsilon',
  description:
    'The digital home of Phi Delta Theta Connecticut Epsilon, connecting active brothers, alumni, future members, families, and friends of the chapter.'
};

export const navItems: NavItem[] = [
  { label: 'Our Chapter', href: '/about' },
  { label: 'Brotherhood', href: '/brotherhood' },
  { label: 'Service', href: '/service' },
  { label: 'Recruitment', href: '/recruitment' },
  { label: 'Events', href: '/events' },
  { label: 'Alumni', href: '/alumni' }
];

export const events: EventItem[] = [];

export const alumniProfiles: AlumniProfile[] = [];

export const newsletters: NewsletterIssue[] = [];

export const alumniSpotlight: Spotlight = {
  name: 'Alumni Spotlight Coming Soon',
  role: 'Connecticut Epsilon Alumnus',
  quote: 'A real spotlight quote from an alumnus will go here.',
  story:
    'Once the chapter has its first graduating class of alumni, this section will feature their story and how Connecticut Epsilon shaped their path after Quinnipiac.'
};

export const legacyVaultItems: LegacyVaultItem[] = [
  {
    id: '1',
    title: 'Founding Composite Board',
    era: '2025',
    type: 'Composite',
    description: 'The first chapter composite will be added here once photographed.'
  },
  {
    id: '2',
    title: 'Charter Letter',
    era: '2025',
    type: 'Document',
    description: 'A record of Connecticut Epsilon’s founding at Quinnipiac University.'
  }
];
