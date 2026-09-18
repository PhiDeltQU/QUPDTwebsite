import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getLegacyVaultItems } from '@/lib/queries/public';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';

export const revalidate = 300;

export default async function LegacyVaultPage() {
  const items = await getLegacyVaultItems();
  return (
    <>
      <PageHero
        eyebrow="Legacy Vault"
        title="Preserve the chapter memory with dignity and depth"
        description="A growing archive of photos, documents, and stories that capture Connecticut Epsilon's history, contributed by the brothers who lived it."
      />
      <SectionShell title="Featured archive categories" description="Every entry has a title, type, era, and description contributed by a member or alumnus.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="surface p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-azure">{item.type}</p>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-fraternity-charcoal">{item.era}</p>
              <p className="mt-4">{item.description}</p>
            </div>
          ))}
        </div>
      </SectionShell>
      <CTASection
        eyebrow="Contribute to the archive"
        title="Share a memory for the chapter archive"
        description="Active members and alumni can submit photos, stories, and artifacts for the chapter to review and preserve."
        actions={<Button href="/legacy-vault/submit" variant="secondary">Submit a memory or artifact</Button>}
      />
    </>
  );
}
