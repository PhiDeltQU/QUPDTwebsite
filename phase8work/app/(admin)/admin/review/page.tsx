import { createServerSupabaseClient, hasSupabaseServerAccess } from '@/lib/supabase/server';

async function getReviewQueue() {
  const supabase = createServerSupabaseClient();

  if (!supabase || !hasSupabaseServerAccess()) {
    return {
      mode: 'demo',
      items: [
        { label: 'Newsletter subscribers', value: '0', detail: 'People who will receive the newsletter.' },
        { label: 'Contact submissions', value: '0', detail: 'Messages from the Contact page. Read them on the Messages page.' },
        { label: 'Profile update requests', value: '0', detail: 'Alumni asking to change their directory info.' },
        { label: 'Mentor applications', value: '0', detail: 'Alumni who signed up to mentor.' },
      ],
    };
  }

  const [subs, contacts, profileUpdates, mentors, mentees] = await Promise.all([
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('inquiry_type', 'profile_update_request'),
    supabase.from('mentors').select('*', { count: 'exact', head: true }),
    supabase.from('mentee_requests').select('*', { count: 'exact', head: true }),
  ]);

  return {
    mode: 'supabase',
    items: [
      { label: 'Active subscribers', value: String(subs.count ?? 0), detail: 'People who will receive the next newsletter.' },
      { label: 'Contact submissions', value: String(contacts.count ?? 0), detail: 'Messages from the Contact page. Read them on the Messages page.' },
      { label: 'Profile update requests', value: String(profileUpdates.count ?? 0), detail: 'Alumni asking to change their directory info. They show up on the Messages page.' },
      { label: 'Mentor applications', value: String(mentors.count ?? 0), detail: 'Alumni who signed up to mentor. Manage them on the Mentorship page.' },
      { label: 'Mentee requests', value: String(mentees.count ?? 0), detail: 'Students asking for a mentor. Match them on the Mentorship page.' },
    ],
  };
}

export default async function ReviewQueuePage() {
  const queue = await getReviewQueue();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">To do</p>
        <h1 className="mt-3 text-4xl">Review queue</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">Counts of things people have sent in through the website that may need your attention.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {queue.items.map((item) => (
          <div key={item.label} className="surface p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-azure">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-fraternity-charcoal">{item.value}</p>
            <p className="mt-3 text-sm text-fraternity-slate">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="surface p-8">
        <h2 className="text-2xl">How to handle these</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="font-semibold text-fraternity-charcoal">Sending a newsletter</p>
            <p className="mt-2 text-sm text-fraternity-slate">Write the issue on the Newsletters page, save it, then press Send issue. Every email includes an unsubscribe link.</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="font-semibold text-fraternity-charcoal">Alumni info changes</p>
            <p className="mt-2 text-sm text-fraternity-slate">When an alumnus asks to update their info, the request shows up on the Messages page. Make the change on the Alumni page, then reply to them.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
