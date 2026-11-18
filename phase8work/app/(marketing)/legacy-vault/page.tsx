import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getLegacyVaultItems } from '@/lib/queries/public';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';
import { getPageContent } from '@/lib/content/get-content';

export const revalidate = 300;

export default async function LegacyVaultPage() {
  const [archive, c] = await Promise.all([getLegacyVaultItems(), getPageContent('legacy-vault')]);

  return (
    <>
      <PageHero eyebrow={c.heroEyebrow} title={c.heroTitle} description={c.heroDescription} />
      <SectionShell title={c.archiveTitle} description={c.archiveDescription}>
        {archive.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {archive.map((item) => (
              <div key={item.id} className="surface p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-azure">{item.type}</p>
                <h3 className="mt-3 text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm font-medium text-fraternity-charcoal">{item.era}</p>
                <p className="mt-4">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">{c.archiveEmptyMessage}</p>
          </div>
        )}
      </SectionShell>
      <CTASection
        eyebrow={c.ctaEyebrow}
        title={c.ctaTitle}
        description={c.ctaDescription}
        actions={
          c.ctaButtonLabel ? (
            <Button href={c.ctaButtonHref} variant="secondary">
              {c.ctaButtonLabel}
            </Button>
          ) : null
        }
      />
    </>
  );
}
