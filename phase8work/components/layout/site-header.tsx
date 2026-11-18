import { getPageContent } from '@/lib/content/get-content';
import { items } from '@/lib/content/fields';
import type { SessionRole } from '@/types';
import { SiteHeaderClient } from './site-header-client';

/** Reads the header text and menu from Site wide settings, then renders the interactive header. */
export async function SiteHeader({ role }: { role: SessionRole | null }) {
  const c = await getPageContent('site');
  return (
    <SiteHeaderClient
      role={role}
      settings={{
        brandName: c.brandName,
        brandChapter: c.brandChapter,
        logoAlt: c.logoAlt || `${c.brandName} ${c.brandChapter} home`,
        nav: items(c, 'nav', 8, ['label', 'href'] as const).map((n) => ({ label: n.label, href: n.href || '/' })),
        button: c.headerButtonLabel ? { label: c.headerButtonLabel, href: c.headerButtonHref || '/' } : null,
      }}
    />
  );
}
