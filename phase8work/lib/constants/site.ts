import { AboutPageContent, AlumniProfile, EventItem, HomePageContent, LegacyVaultItem, NavItem, NewsletterIssue, Spotlight, Stat, TimelineEntry } from '@/types';

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

export const chapterStats: Stat[] = [
  { value: '2025', label: 'Chapter Founded', description: 'The beginning of Connecticut Epsilon at Quinnipiac University.' },
  { value: '4', label: 'Ways to Belong', description: 'Active brothers, alumni, future members, and chapter supporters.' },
  { value: 'Year-round', label: 'Chapter Connection', description: 'Events, updates, service, mentorship, and brotherhood in one place.' },
  { value: '1', label: 'Shared Digital Home', description: 'A platform designed to serve the chapter across generations.' }
];

export const values = [
  {
    title: 'Friendship',
    description: 'Build genuine relationships that begin on campus and continue through every season of life.'
  },
  {
    title: 'Sound Learning',
    description: 'Support academic growth, thoughtful leadership, and the confidence to keep learning beyond college.'
  },
  {
    title: 'Rectitude',
    description: 'Lead with integrity, responsibility, and service to the chapter, campus, and wider community.'
  }
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

export const timeline: TimelineEntry[] = [
  {
    year: '2025',
    title: 'Chapter Founded',
    description: 'Connecticut Epsilon begins building a Phi Delta Theta experience rooted in friendship, sound learning, and rectitude.'
  },
  {
    year: 'Today',
    title: 'Building the Foundation',
    description: 'Active brothers are establishing the traditions, service programs, and leadership culture that will define the chapter.'
  },
  {
    year: 'Next',
    title: 'Growing Across Generations',
    description: 'The chapter hub will preserve institutional memory and keep future members, active brothers, and alumni connected.'
  }
];

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


export const defaultHomePageContent: HomePageContent = {
  heroEyebrow: 'Phi Delta Theta Connecticut Epsilon',
  heroTitle: 'One chapter. Every generation. One home.',
  heroDescription: 'The central home for chapter life at Quinnipiac University - connecting active brothers, future members, alumni, families, and friends.',
  missionEyebrow: 'Chapter Hub',
  missionTitle: 'Built for every stage of brotherhood',
  missionDescription: 'Discover chapter life, explore recruitment, stay connected after graduation, and find meaningful ways to support Connecticut Epsilon.',
  valuesEyebrow: 'Values',
  valuesTitle: 'The principles behind the chapter experience',
  valuesDescription: 'Friendship, sound learning, and rectitude guide how Connecticut Epsilon learns, leads, serves, and grows together.',
  statsEyebrow: 'Find Your Place',
  statsTitle: 'One hub with a path for everyone',
  statsDescription: 'Whether you are exploring membership, active in the chapter, returning as an alumnus, or supporting from the community, there is a place to begin.',
  eventsEyebrow: 'Chapter Calendar',
  eventsTitle: 'Come together on campus and beyond',
  eventsDescription: 'Discover brotherhood, service, professional, and alumni events that keep the Connecticut Epsilon community connected.',
  newsletterEyebrow: 'Chapter News',
  newsletterTitle: 'Stay connected to what is happening now',
  newsletterDescription: 'Read chapter updates, event recaps, alumni stories, and opportunities to take part in what comes next.',
  spotlightEyebrow: 'Brotherhood in Action',
  spotlightTitle: 'A chapter experience that keeps growing',
  spotlightDescription: 'The chapter hub brings today\'s brotherhood together with the alumni network and the members who will carry it forward.',
  legacyEyebrow: 'Legacy Vault',
  legacyTitle: 'Preserve the story as the chapter grows',
  legacyDescription: 'Keep composite boards, photos, letters, milestone documents, and shared memories accessible to the generations that follow.',
  finalCtaEyebrow: 'Your Next Step',
  finalCtaTitle: 'Find your place in Connecticut Epsilon',
  finalCtaDescription: 'Explore recruitment, attend an event, reconnect through the alumni network, or support the chapter with your time and experience.'
};

export const defaultAboutPageContent: AboutPageContent = {
  heroEyebrow: 'Our Chapter',
  heroTitle: 'Building the Connecticut Epsilon story together',
  heroDescription: 'Founded at Quinnipiac University, Connecticut Epsilon is creating a chapter culture centered on friendship, learning, integrity, leadership, and service.',
  overviewTitle: 'A young chapter with a long view',
  overviewDescription: 'The chapter is building traditions today with the intention that they will strengthen brothers and connect generations for decades to come.',
  overviewBody: 'Connecticut Epsilon gives members a place to form close friendships, take on meaningful responsibility, contribute to campus life, and grow into principled leaders.',
  overviewBodySecondary: 'This digital hub supports that mission by bringing chapter information, recruitment, events, member access, alumni connection, and history into one lasting home.',
  themesTitle: 'What defines the chapter',
  themeOneTitle: 'Brotherhood',
  themeOneDescription: 'A culture of trust, accountability, shared experience, and lifelong friendship.',
  themeTwoTitle: 'Growth',
  themeTwoDescription: 'Academic, personal, and leadership development shaped by real responsibility and support.',
  themeThreeTitle: 'Service',
  themeThreeDescription: 'A commitment to leave the chapter, campus, and surrounding community stronger than we found them.',
  timelineEyebrow: 'Our Story',
  timelineTitle: 'A foundation future generations can build on',
  timelineDescription: 'Connecticut Epsilon is still writing its earliest chapters. This timeline will grow alongside the milestones, traditions, and brothers who shape it.'
};
