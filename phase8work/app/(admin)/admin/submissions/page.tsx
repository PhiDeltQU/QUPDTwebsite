import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const TOPIC_LABELS: Record<string, string> = {
  general: 'General question',
  directory: 'Update alumni information',
  volunteer: 'Volunteer or mentor interest',
  event: 'Event planning',
  legacy: 'Legacy Vault contribution',
  donation: 'Donation or support',
  profile_update_request: 'Profile update request (from the alumni portal)',
};

type ContactRow = { id: string; full_name: string; email: string; inquiry_type: string | null; message: string | null; created_at: string | null };
type RsvpRow = {
  id: string;
  full_name: string;
  email: string;
  graduation_year: number | null;
  guest_count: number | null;
  notes: string | null;
  created_at: string | null;
  events: { title: string; event_date: string } | { title: string; event_date: string }[] | null;
};

function formatDate(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/New_York' }).format(new Date(value));
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

function DownloadLink({ type, label }: { type: string; label: string }) {
  return (
    <a
      href={`/api/admin/export/${type}`}
      className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-parchment"
    >
      {label}
    </a>
  );
}

export default async function MessagesAdminPage() {
  const supabase = createServerSupabaseClient();

  let contacts: ContactRow[] = [];
  let rsvps: RsvpRow[] = [];
  let loadError: string | null = null;

  if (supabase) {
    const [contactRes, rsvpRes] = await Promise.all([
      supabase.from('contact_submissions').select('id, full_name, email, inquiry_type, message, created_at').order('created_at', { ascending: false }).limit(500),
      supabase
        .from('event_rsvps')
        .select('id, full_name, email, graduation_year, guest_count, notes, created_at, events(title, event_date)')
        .order('created_at', { ascending: false })
        .limit(1000),
    ]);
    if (contactRes.error) loadError = contactRes.error.message;
    if (rsvpRes.error) loadError = loadError || rsvpRes.error.message;
    contacts = (contactRes.data || []) as ContactRow[];
    rsvps = (rsvpRes.data || []) as unknown as RsvpRow[];
  }

  const rsvpGroups = new Map<string, { title: string; date: string; rows: RsvpRow[] }>();
  for (const rsvp of rsvps) {
    const event = Array.isArray(rsvp.events) ? rsvp.events[0] : rsvp.events;
    const key = event ? `${event.event_date}|${event.title}` : 'unknown';
    if (!rsvpGroups.has(key)) rsvpGroups.set(key, { title: event?.title || 'Deleted event', date: event?.event_date || '', rows: [] });
    rsvpGroups.get(key)!.rows.push(rsvp);
  }
  const groups = [...rsvpGroups.values()].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Messages</p>
        <h1 className="mt-3 text-4xl">Messages and RSVPs</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Everything people send through the website lands here: messages from the Contact page and RSVPs for events. Click an email address to reply.
        </p>
        {!supabase ? (
          <p className="mt-4 rounded-2xl bg-fraternity-parchment px-4 py-3 text-sm text-fraternity-charcoal">Demo mode: the database is not connected, so there are no messages to show.</p>
        ) : null}
        {loadError ? <p className="mt-4 text-sm text-red-700">Some messages could not be loaded: {loadError}</p> : null}
      </div>

      <div className="surface p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">Contact messages</h2>
            <p className="mt-1 text-sm text-fraternity-slate">{contacts.length === 0 ? 'No messages yet.' : `${contacts.length} message${contacts.length === 1 ? '' : 's'}, newest first.`}</p>
          </div>
          <DownloadLink type="contacts" label="Download as spreadsheet" />
        </div>
        <ul className="mt-6 space-y-4">
          {contacts.map((contact) => (
            <li key={contact.id} className="rounded-2xl border border-black/10 bg-white px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <p className="font-semibold text-fraternity-charcoal">
                  {contact.full_name}{' '}
                  <a href={`mailto:${contact.email}`} className="font-normal text-fraternity-azure underline">
                    {contact.email}
                  </a>
                </p>
                <p className="text-xs text-fraternity-slate">{formatDate(contact.created_at)}</p>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-fraternity-azure">
                {TOPIC_LABELS[contact.inquiry_type || ''] || contact.inquiry_type || 'General question'}
              </p>
              {contact.message ? <p className="mt-3 whitespace-pre-wrap text-sm text-fraternity-charcoal">{contact.message}</p> : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="surface p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">Event RSVPs</h2>
            <p className="mt-1 text-sm text-fraternity-slate">{rsvps.length === 0 ? 'No RSVPs yet.' : 'Grouped by event, most recent event first.'}</p>
          </div>
          <DownloadLink type="rsvps" label="Download as spreadsheet" />
        </div>
        <div className="mt-6 space-y-6">
          {groups.map((group) => {
            const guests = group.rows.reduce((sum, row) => sum + (row.guest_count || 0), 0);
            return (
              <div key={`${group.date}-${group.title}`} className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-lg font-semibold text-fraternity-charcoal">{group.title}</p>
                <p className="text-sm text-fraternity-slate">
                  {group.date ? `${formatEventDate(group.date)} · ` : ''}
                  {group.rows.length} RSVP{group.rows.length === 1 ? '' : 's'}
                  {guests ? `, plus ${guests} guest${guests === 1 ? '' : 's'}` : ''}
                </p>
                <ul className="mt-4 divide-y divide-black/5">
                  {group.rows.map((row) => (
                    <li key={row.id} className="py-3 text-sm">
                      <span className="font-semibold text-fraternity-charcoal">{row.full_name}</span>{' '}
                      <a href={`mailto:${row.email}`} className="text-fraternity-azure underline">
                        {row.email}
                      </a>
                      {row.graduation_year ? <span className="text-fraternity-slate"> · Class of {row.graduation_year}</span> : null}
                      {row.guest_count ? <span className="text-fraternity-slate"> · +{row.guest_count} guest{row.guest_count === 1 ? '' : 's'}</span> : null}
                      {row.notes ? <p className="mt-1 whitespace-pre-wrap text-fraternity-slate">{row.notes}</p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
