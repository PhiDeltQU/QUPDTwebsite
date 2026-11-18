import Link from 'next/link';

const guides: { title: string; steps: (string | { text: string; href: string })[] }[] = [
  {
    title: 'Change words, photos, or buttons on any page',
    steps: [
      { text: 'Open Edit pages in the menu.', href: '/admin/content' },
      'Pick the page you want. Sections are listed top to bottom in the same order as the real page.',
      'Click a section to open it, then type in the boxes. Changed boxes turn blue.',
      'Press Save changes at the bottom of the screen. The change is live right away. Use View page to check it.',
      'Made a mistake? Press Restore original next to the box to put the starting text back, then save.',
      'To hide a card, button, or list item, clear its first box (usually the title or button text) and save.',
      'To change a photo, press Upload new photo and choose a JPG or PNG from your computer. Wide photos look best.',
      'Links can be a page on this site (like /contact) or a full web address (like https://www.instagram.com/...).',
    ],
  },
  {
    title: 'Change the menu, footer, or LinkedIn popup',
    steps: [
      { text: 'Open Edit pages, then Site wide settings.', href: '/admin/content/site' },
      'The header menu, footer columns, social links, chapter email, and the home page LinkedIn popup are all there.',
      'The cardinal principles (Friendship, Sound Learning, Rectitude) are edited here once and show up on every page that uses them.',
    ],
  },
  {
    title: 'Add or remove an event',
    steps: [
      { text: 'Open Events.', href: '/admin/events' },
      'Fill in the form. The slug is the end of the web address, like founders-day-2027 (lowercase, dashes, no spaces).',
      'Set Status to published to show it on the site. Past events move off the upcoming list automatically.',
      'RSVPs for each event can be downloaded from the Overview page.',
    ],
  },
  {
    title: 'Write and send a newsletter',
    steps: [
      { text: 'Open Newsletters.', href: '/admin/newsletters' },
      'Write the issue and save it as a draft. Drafts are not public.',
      'When it is ready, change the status to published, then press Send issue. It goes to every active subscriber.',
      'Every email includes an unsubscribe link. People who unsubscribe are skipped automatically next time.',
      'An issue that was already sent asks you to confirm before sending again, so nobody gets it twice by accident.',
      'Delete test issues with the delete button so they do not show in the public archive.',
    ],
  },
  {
    title: 'Add alumni and members',
    steps: [
      { text: 'One at a time: Alumni and members.', href: '/admin/alumni' },
      { text: 'Many at once: Import from spreadsheet. Export your Google Sheet as CSV and paste or upload it.', href: '/admin/import' },
      'Columns it understands include full_name, email, phone, major, graduation_year, and graduation_term (Spring or Fall).',
      'The alumni Google Form also adds people automatically.',
      'After they are added, alumni claim their own account at /member/claim using the email on file. They get a link by email and pick a password.',
    ],
  },
  {
    title: 'Check messages and submissions',
    steps: [
      { text: 'Messages from the Contact page are under Messages.', href: '/admin/submissions' },
      { text: 'Photos and stories brothers submit for the Legacy Vault wait under Legacy Vault submissions. Approve or decline each one.', href: '/admin/legacy-review' },
      { text: 'Mentorship applications and alumni posted opportunities are under Mentorship.', href: '/admin/mentorship' },
    ],
  },
  {
    title: 'Give another officer admin access',
    steps: [
      { text: 'Open Admins and add their email.', href: '/admin/admins' },
      'Tell them the admin password in person or by text. Everyone uses the same password with their own email.',
      'Removing someone on the Admins page signs them out right away.',
      'When officers change over, ask whoever manages the Vercel account to change the admin password.',
    ],
  },
];

export default function AdminHelpPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">How to use this</p>
        <h1 className="mt-3 text-4xl">Running the chapter website</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          You never need to touch code. Everything on the public site is changed from the menu on the left. Here is how to do the common jobs.
        </p>
      </div>

      {guides.map((guide) => (
        <section key={guide.title} className="surface p-8">
          <h2 className="text-2xl">{guide.title}</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-fraternity-charcoal">
            {guide.steps.map((step, index) => (
              <li key={index}>
                {typeof step === 'string' ? (
                  step
                ) : (
                  <Link href={step.href} className="font-medium text-fraternity-azure hover:underline">
                    {step.text}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}

      <section className="surface p-8">
        <h2 className="text-2xl">Things that need the account owner</h2>
        <p className="mt-3 text-fraternity-slate">
          A few things live outside this admin area: the web address (domain), the hosting account (Vercel), the database (Supabase), and the
          email sender (Resend). You only need those to change the admin password, change where contact form emails go, or if the site goes
          down. Ask the previous alumni chair or webmaster for access.
        </p>
      </section>
    </div>
  );
}
