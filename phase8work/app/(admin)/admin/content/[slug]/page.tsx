import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentEditor } from '@/components/admin/content-editor';
import { getPageContent } from '@/lib/content/get-content';
import { getPageDefinition } from '@/lib/content/registry';

export const dynamic = 'force-dynamic';

export default async function EditPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const definition = getPageDefinition(slug);
  if (!definition) notFound();
  const content = await getPageContent(slug);

  return (
    <div className="space-y-6 py-2">
      <div className="surface p-8">
        <Link href="/admin/content" className="text-sm font-medium text-fraternity-azure hover:underline">
          ← All pages
        </Link>
        <h1 className="mt-3 text-4xl">{definition.label}</h1>
        <p className="mt-3 max-w-3xl text-fraternity-slate">
          Sections are listed top to bottom in the same order they appear on the page. Click a section to open it. Boxes you have changed are
          highlighted until you save.
        </p>
      </div>
      <ContentEditor definition={definition} initial={content} />
    </div>
  );
}
