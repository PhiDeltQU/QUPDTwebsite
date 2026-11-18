import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { contentPages, pageFields } from '@/lib/content/registry';

export default function ContentAdminPage() {
  return (
    <div className="space-y-6 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">Edit website</p>
        <h1 className="mt-3 text-4xl">Pages</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Pick a page to change its words, photos, and buttons. Edit the boxes, then press <strong>Save changes</strong> at the bottom. Changes go
          live right away. If you make a mistake, use <strong>Restore original</strong> next to any box.
        </p>
        <p className="mt-3 max-w-3xl text-sm text-fraternity-slate">
          Events, newsletters, alumni, and Legacy Vault items are managed from their own tabs in the menu on the left.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {contentPages.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/content/${page.slug}`}
            className="surface group flex items-center justify-between gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <h2 className="text-xl">{page.label}</h2>
              <p className="mt-1 text-sm text-fraternity-slate">
                {page.description} {pageFields(page).length} editable items.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-fraternity-azure transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
