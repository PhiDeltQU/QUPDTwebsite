import { area, headingFields, heroFields, text } from '../fields';
import type { PageDefinition } from '../types';

export const mentorshipPage: PageDefinition = {
  slug: 'mentorship',
  label: 'Mentorship',
  path: '/mentorship',
  description: 'Mentorship intro, headings, and empty messages. Opportunities are posted by alumni and managed in the Mentorship tab.',
  sections: [
    {
      title: 'Top of page',
      fields: heroFields('hero', {
        eyebrow: 'Mentorship',
        title: 'Connect alumni experience with the next generation of brothers',
        description:
          'Brothers can connect through one on one mentorship, career conversations, and alumni posted opportunities including internships, office hours, and professional guidance.',
      }),
    },
    {
      title: 'Opportunities',
      fields: [
        ...headingFields('opportunities', {
          eyebrow: 'Live opportunities',
          title: 'Explore alumni posted mentorship and internship opportunities',
          description:
            'Verified alumni can post mentorship and internship opportunities through the alumni portal. Active members can apply with verified profile information and supporting materials.',
        }),
        area(
          'opportunitiesEmptyMessage',
          'Message when no opportunities are posted',
          'No live opportunities are posted yet. Alumni can create new mentorship or internship opportunities from the alumni portal.',
        ),
        text('opportunityDetailsLabel', 'Details button text', 'View details'),
        text('opportunityApplyLabel', 'Apply button text', 'Apply now'),
      ],
    },
    {
      title: 'Mentor spotlights',
      fields: [
        ...headingFields('mentors', {
          title: 'Mentor spotlights',
          description: 'Alumni who have volunteered to mentor active brothers and future members.',
        }),
        area('mentorsEmptyMessage', 'Message when no mentors are listed', 'No mentors are listed yet. Alumni can opt in through the alumni portal.'),
      ],
    },
  ],
};
