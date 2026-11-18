import { AdminListCard } from '@/components/admin/admin-list-card';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { getAdminOverview, getAdminRecentItems } from '@/lib/queries/admin';

const exportsList = [
  { type: 'alumni', label: 'Alumni records' },
  { type: 'subscribers', label: 'Newsletter subscribers' },
  { type: 'rsvps', label: 'Event RSVPs' },
  { type: 'contacts', label: 'Contact form messages' },
  { type: 'events', label: 'Events' },
  { type: 'newsletters', label: 'Newsletter issues' },
];

export default async function AdminPage() {
  const [{ stats, dataSource }, recent] = await Promise.all([getAdminOverview(), getAdminRecentItems()]);

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Admin overview</p>
        <h1 className="mt-3 text-4xl">Chapter dashboard</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          A quick look at what is on the website. Use the menu on the left to edit pages, post events, send newsletters, and review submissions.
        </p>
        {dataSource !== 'supabase' ? (
          <p className="mt-4 max-w-3xl rounded-2xl bg-fraternity-parchment px-4 py-3 text-sm text-fraternity-charcoal">
            Demo mode: the database is not connected, so changes here are only saved on this computer.
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Alumni profiles" value={stats.alumniCount} helper="Alumni records in the directory." />
        <AdminStatCard label="Available mentors" value={stats.mentorsCount} helper="Brothers who signed up to mentor." />
        <AdminStatCard label="Published events" value={stats.upcomingEvents} helper="Events shown on the Events page." />
        <AdminStatCard label="Newsletter issues" value={stats.newsletterCount} helper="Issues in the newsletter archive." />
        <AdminStatCard label="Pending legacy items" value={stats.pendingLegacySubmissions} helper="Legacy Vault submissions waiting for your review." />
        <AdminStatCard label="Contact submissions" value={stats.unreadContacts} helper="Messages sent through the Contact page." />
      </div>

      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Downloads</p>
        <h2 className="mt-2 text-2xl">Download a spreadsheet</h2>
        <p className="mt-2 max-w-3xl text-sm text-fraternity-slate">
          Each button downloads a CSV file that opens in Excel or Google Sheets.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {exportsList.map((item) => (
            <a
              key={item.type}
              href={`/api/admin/export/${item.type}`}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-parchment"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminListCard title="Recent alumni" description="Newest alumni records." items={recent.recentAlumni} />
        <AdminListCard title="Recent events" description="Newest events." items={recent.recentEvents} />
        <AdminListCard title="Recent newsletters" description="Newest newsletter issues and whether they were sent." items={recent.recentNewsletters} />
      </div>
    </div>
  );
}
