import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { PathwayCard } from '@/components/cards/pathway-card';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

export const metadata: Metadata = {
  title: 'Member Sign In',
  description: 'Choose the correct Phi Delta Theta Connecticut Epsilon member or officer portal.',
};

export default async function AccessPage() {
  const c = await getPageContent('access');
  const portals = items(c, 'portal', 4, ['title', 'eyebrow', 'description', 'linkLabel', 'href'] as const);

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} description={c.heroDescription} />
      <SectionShell title={c.portalsTitle} description={c.portalsDescription}>
        <div className="grid gap-6 lg:grid-cols-3">
          {portals.map((portal) => (
            <PathwayCard key={portal.title} {...portal} href={portal.href || '/access'} />
          ))}
        </div>
      </SectionShell>
    </>
  );
}
