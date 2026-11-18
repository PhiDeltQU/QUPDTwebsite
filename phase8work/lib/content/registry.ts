import { aboutPage } from './pages/about';
import { accessPage } from './pages/access';
import { brotherhoodPage } from './pages/brotherhood';
import { contactPage } from './pages/contact';
import { eventsPage } from './pages/events';
import { getInvolvedPage } from './pages/get-involved';
import { homePage } from './pages/home';
import { legacyVaultPage } from './pages/legacy-vault';
import { mentorshipPage } from './pages/mentorship';
import { newsletterPage } from './pages/newsletter';
import { recruitmentPage } from './pages/recruitment';
import { servicePage } from './pages/service';
import { siteSettings } from './pages/site';
import type { PageContent, PageDefinition } from './types';

/** Every editable page, in the order officers see them in the editor. */
export const contentPages: PageDefinition[] = [
  siteSettings,
  homePage,
  aboutPage,
  brotherhoodPage,
  servicePage,
  recruitmentPage,
  eventsPage,
  newsletterPage,
  mentorshipPage,
  legacyVaultPage,
  getInvolvedPage,
  contactPage,
  accessPage,
];

export function getPageDefinition(slug: string) {
  return contentPages.find((page) => page.slug === slug);
}

export function pageFields(definition: PageDefinition) {
  return definition.sections.flatMap((section) => section.fields);
}

export function pageDefaults(definition: PageDefinition): PageContent {
  return Object.fromEntries(pageFields(definition).map((field) => [field.key, field.default]));
}
