import { ApiForm } from '@/components/forms/api-form';
import { AdminTable } from '@/components/admin/admin-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getAdminNewsletterRecords } from '@/lib/queries/admin';
import { NewsletterSendButton } from '@/components/admin/newsletter-send-button';

export default async function NewslettersAdminPage() {
  const rows = await getAdminNewsletterRecords();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Admin</p>
        <h1 className="mt-3 text-4xl">Newsletters</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">This phase makes newsletter records function locally even before email sending is connected.</p>
      </div>



      <div className="surface p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Send workflow</p>
            <h2 className="mt-2 text-2xl">Issue delivery controls</h2>
            <p className="mt-2 max-w-2xl text-sm text-fraternity-slate">Send an issue to every active subscriber. Each email includes an unsubscribe link. Issues already sent ask for confirmation before sending again, so nobody gets duplicates by accident.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-black/10 bg-white px-4 py-4 md:flex md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-fraternity-charcoal">{row.primary}</p>
                <p className="text-sm text-fraternity-slate">{row.secondary}</p>
              </div>
              <div className="mt-3 md:mt-0">
                <NewsletterSendButton newsletterId={row.id} alreadySent={row.badge === 'sent'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <ApiForm
  title="Create newsletter issue"
  description="Write a new issue. Save it as a draft first, then use Send issue above when it is ready."
  endpoint="/api/admin/newsletters"
  successMessage="Newsletter issue submitted successfully."
  submitLabel="Save issue"
>
  <div className="grid gap-5 md:grid-cols-2">
    <Field label="Title">
      <Input name="title" required maxLength={120} />
    </Field>

    <Field label="Slug">
      <Input
        name="slug"
        placeholder="spring-2026-brotherhood-update"
        required
        maxLength={160}
      />
    </Field>

    <Field label="Category">
      <Input name="category" placeholder="Chapter Update" required maxLength={60} />
    </Field>

    <Field label="Issue date">
      <Input name="issueDate" type="date" required />
    </Field>

    <Field label="Subject line">
      <Input name="subjectLine" required maxLength={160} />
    </Field>

    <Field label="Status">
      <Select name="status" defaultValue="draft">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="sent">Sent</option>
      </Select>
    </Field>
  </div>

  <Field label="Summary">
    <>
      <Textarea
        name="summary"
        rows={3}
        required
        minLength={10}
        maxLength={160}
      />
      <p className="mt-2 text-xs text-fraternity-slate">
        10–160 characters. This should be a short preview, not the full issue.
      </p>
    </>
  </Field>

  <Field label="Body content">
    <>
      <Textarea
        name="bodyContent"
        rows={7}
        required
        minLength={20}
        maxLength={10000}
      />
      <p className="mt-2 text-xs text-fraternity-slate">
        Minimum 20 characters. This is the full newsletter body.
      </p>
    </>
  </Field>

  <Checkbox name="isFeatured" label="Feature this issue on the homepage" />
</ApiForm>
        <AdminTable title="Newsletter records" rows={rows} deleteEndpoint="/api/admin/newsletters" exportHref="/api/admin/export/newsletters" editBaseHref="/admin/newsletters" />
      </div>
    </div>
  );
}
