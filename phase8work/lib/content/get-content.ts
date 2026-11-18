import { cache } from 'react';
import { readDemoStore } from '@/lib/demo-store';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { STALE_SEED_VALUES } from './stale-seed-values';
import { getPageDefinition, pageDefaults } from './registry';
import type { PageContent } from './types';

/**
 * Loads every editable field for a page: the officer's saved value when there is one,
 * otherwise the default written in lib/content/pages/<page>.ts.
 */
export const getPageContent = cache(async (slug: string): Promise<PageContent> => {
  const definition = getPageDefinition(slug);
  if (!definition) throw new Error(`Unknown content page: ${slug}`);
  const content = pageDefaults(definition);
  const saved = await readSaved(slug);
  const stale = STALE_SEED_VALUES[slug] ?? {};

  for (const [key, value] of Object.entries(saved)) {
    if (!(key in content) || value === null || value === undefined) continue;
    // Old starter template copy that was seeded into the live database. Treat as unset.
    if (stale[key] !== undefined && stale[key] === value) continue;
    content[key] = value;
  }
  return content;
});

async function readSaved(slug: string): Promise<Record<string, string | null>> {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    try {
      return (await readDemoStore()).siteContent[slug] ?? {};
    } catch {
      return {};
    }
  }

  const { data, error } = await supabase.from('site_content').select('content_key, content_value').eq('page_slug', slug);
  if (error || !data) return {};
  return Object.fromEntries(data.map((row) => [row.content_key as string, row.content_value as string | null]));
}
