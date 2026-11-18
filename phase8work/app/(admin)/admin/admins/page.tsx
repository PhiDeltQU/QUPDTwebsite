import { AdminDeleteButton } from '@/components/admin/admin-delete-button';
import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type AdminRow = { id: string; email: string; full_name: string | null; created_at: string | null };

export default async function AdminsPage() {
  const session = await requireSession('admin');
  const supabase = createServerSupabaseClient();

  let admins: AdminRow[] = [];
  let loadError: string | null = null;
  if (supabase) {
    const { data, error } = await supabase.from('admin_users').select('id, email, full_name, created_at').order('created_at', { ascending: true });
    if (error) loadError = error.message;
    admins = (data || []) as AdminRow[];
  }

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Admins</p>
        <h1 className="mt-3 text-4xl">Who can use this admin area</h1>
        <div className="mt-4 max-w-3xl space-y-3 text-fraternity-slate">
          <p>To sign in as an admin, a person needs two things: their email on the list below, and the admin password.</p>
          <p>
            Everyone shares the same admin password. It is stored in Vercel as <strong>ADMIN_LOGIN_PASSWORD</strong>. If someone leaves and you are worried
            they still know it, change it in Vercel (Project, Settings, Environment Variables) and redeploy.
          </p>
          <p>Removing someone from this list signs them out right away, even if they are logged in on another device.</p>
        </div>
      </div>

      {!supabase ? (
        <div className="surface p-8 text-fraternity-slate">Demo mode: the database is not connected, so the admin list is not available.</div>
      ) : (
        <>
          <div className="surface p-8">
            <h2 className="text-2xl">Current admins</h2>
            {loadError ? <p className="mt-4 text-sm text-red-700">Could not load admins: {loadError}</p> : null}
            <ul className="mt-6 space-y-3">
              {admins.map((admin) => {
                const isYou = admin.email.toLowerCase() === session?.email.toLowerCase();
                return (
                  <li key={admin.id} className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-fraternity-charcoal">
                        {admin.full_name || admin.email}
                        {isYou ? <span className="ml-2 text-xs font-normal text-fraternity-slate">(you)</span> : null}
                      </p>
                      {admin.full_name ? <p className="text-sm text-fraternity-slate">{admin.email}</p> : null}
                    </div>
                    {!isYou && admins.length > 1 ? <AdminDeleteButton endpoint="/api/admin/admins" id={admin.id} /> : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <ApiForm
            title="Add an admin"
            description="Enter the email they will sign in with. After adding them, send them the admin password privately (text or in person, not in a group chat)."
            endpoint="/api/admin/admins"
            successMessage="Admin added."
            submitLabel="Add admin"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Email">
                <Input name="email" type="email" required placeholder="name@quinnipiac.edu" />
              </Field>
              <Field label="Name (optional)">
                <Input name="fullName" placeholder="Their name" />
              </Field>
            </div>
          </ApiForm>
        </>
      )}
    </div>
  );
}
