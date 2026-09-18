import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AlumniProfile, EventItem, LegacyVaultItem, NewsletterIssue, Spotlight } from '@/types';
import {
  legacyVaultItems as fallbackLegacy,
  alumniSpotlight as fallbackSpotlight,
  alumniProfiles as fallbackAlumniProfiles,
  events as fallbackEvents,
  newsletters as fallbackNewsletters
} from '@/lib/constants/site';

type DbAlumniRow = {
  full_name: string;
  graduation_year: number | null;
  member_status: string | null;
  alumni_access_enabled: boolean | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  location: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  willing_to_mentor: boolean | null;
  major: string | null;
  is_featured: boolean | null;
};

type DbEventRow = {
  slug: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  description: string | null;
  is_featured: boolean | null;
  audience: string | null;
  image_hint: string | null;
  body_content: string | null;
  tags: string[] | null;
};

type DbNewsletterRow = {
  slug: string;
  title: string;
  summary: string | null;
  issue_date: string | null;
  status: string | null;
  body_content: string | null;
  category: string | null;
};

type DbLegacyRow = {
  id: string;
  title: string;
  year_label: string | null;
  item_type: LegacyVaultItem['type'] | null;
  description: string | null;
};

type DbSpotlightRow = {
  title: string;
  excerpt: string | null;
  body_content: string | null;
};

function formatDate(date: string | null) {
  if (!date) return 'TBD';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(parsed);
}

function formatMonthYear(date: string | null) {
  if (!date) return 'Draft';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(parsed);
}

function paragraphize(content: string | null | undefined) {
  if (!content) return undefined;
  return content.split('\n\n').map((item) => item.trim()).filter(Boolean);
}

function mapAlumniRow(row: DbAlumniRow): AlumniProfile {
  return {
    name: row.full_name,
    gradYear: row.graduation_year ? String(row.graduation_year) : '—',
    company: row.company ?? '—',
    title: row.job_title ?? '—',
    industry: row.industry ?? '—',
    location: row.location ?? '—',
    bio: row.short_bio ?? 'Profile coming soon.',
    linkedin: row.linkedin_url ?? undefined,
    mentor: Boolean(row.willing_to_mentor),
    major: row.major ?? undefined,
    featured: Boolean(row.is_featured)
  };
}

function mapEventRow(row: DbEventRow): EventItem {
  return {
    slug: row.slug,
    title: row.title,
    date: formatDate(row.event_date),
    time: row.event_time ?? 'TBD',
    location: row.location ?? 'Location TBA',
    description: row.description ?? 'Event details coming soon.',
    featured: Boolean(row.is_featured),
    audience: row.audience ?? undefined,
    imageHint: row.image_hint ?? undefined,
    body: paragraphize(row.body_content),
    tags: row.tags ?? undefined
  };
}

function mapNewsletterRow(row: DbNewsletterRow): NewsletterIssue {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.summary ?? 'Newsletter summary coming soon.',
    date: formatMonthYear(row.issue_date),
    category: row.category ?? row.status ?? 'Newsletter',
    body: paragraphize(row.body_content)
  };
}

function mapLegacyRow(row: DbLegacyRow): LegacyVaultItem {
  return {
    id: row.id,
    title: row.title,
    era: row.year_label ?? 'Undated',
    type: row.item_type ?? 'Story',
    description: row.description ?? 'Archive details coming soon.'
  };
}

function mapSpotlightRow(row: DbSpotlightRow): Spotlight {
  return {
    name: row.title,
    role: fallbackSpotlight.role,
    quote: row.excerpt ?? fallbackSpotlight.quote,
    story: row.body_content ?? fallbackSpotlight.story
  };
}

export async function getAlumniProfiles(): Promise<AlumniProfile[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackAlumniProfiles;

  const { data, error } = await supabase
    .from('alumni_profiles')
    .select('full_name, graduation_year, member_status, alumni_access_enabled, company, job_title, industry, location, short_bio, linkedin_url, willing_to_mentor, major, is_featured')
    .eq('is_public', true)
    .eq('member_status', 'alumni')
    .eq('alumni_access_enabled', true)
    .order('graduation_year', { ascending: false })
    .order('full_name', { ascending: true })
    .limit(1000);

  if (error) {
    console.error('[getAlumniProfiles]', error);
    return fallbackAlumniProfiles;
  }
  if (!data?.length) return fallbackAlumniProfiles;
  return (data as DbAlumniRow[]).map(mapAlumniRow);
}

export async function getEvents(): Promise<EventItem[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackEvents;

  const { data, error } = await supabase
    .from('events')
    .select('slug, title, event_date, event_time, location, description, is_featured, audience, image_hint, body_content, tags')
    .eq('status', 'published')
    .order('event_date', { ascending: true })
    .limit(1000);

  if (error) {
    console.error('[getEvents]', error);
    return fallbackEvents;
  }
  if (!data?.length) return fallbackEvents;
  return (data as DbEventRow[]).map(mapEventRow);
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackEvents.find((event) => event.slug === slug) ?? null;

  const { data } = await supabase
    .from('events')
    .select('slug, title, event_date, event_time, location, description, is_featured, audience, image_hint, body_content, tags')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return null;
  return mapEventRow(data as DbEventRow);
}

export async function getNewsletters(): Promise<NewsletterIssue[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackNewsletters;

  const { data, error } = await supabase
    .from('newsletters')
    .select('slug, title, summary, issue_date, status, body_content, category')
    .in('status', ['published', 'sent'])
    .order('issue_date', { ascending: false })
    .limit(1000);

  if (error) {
    console.error('[getNewsletters]', error);
    return fallbackNewsletters;
  }
  if (!data?.length) return fallbackNewsletters;
  return (data as DbNewsletterRow[]).map(mapNewsletterRow);
}

export async function getNewsletterBySlug(slug: string): Promise<NewsletterIssue | null> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackNewsletters.find((issue) => issue.slug === slug) ?? null;

  const { data } = await supabase
    .from('newsletters')
    .select('slug, title, summary, issue_date, status, body_content, category')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return null;
  return mapNewsletterRow(data as DbNewsletterRow);
}

export async function getLegacyVaultItems(): Promise<LegacyVaultItem[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackLegacy;

  const { data, error } = await supabase
    .from('legacy_vault_items')
    .select('id, title, year_label, item_type, description')
    .eq('status', 'approved')
    .order('year_label', { ascending: false })
    .limit(1000);

  if (error || !data?.length) return fallbackLegacy;
  return (data as DbLegacyRow[]).map(mapLegacyRow);
}

export async function getFeaturedSpotlight(): Promise<Spotlight> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return fallbackSpotlight;

  const { data, error } = await supabase
    .from('spotlight_posts')
    .select('title, excerpt, body_content')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return fallbackSpotlight;
  return mapSpotlightRow(data as DbSpotlightRow);
}
