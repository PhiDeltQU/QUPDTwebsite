import type { MetadataRoute } from 'next';
import { getEvents, getNewsletters } from '@/lib/queries/public';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ctepsilonphidelts.org').replace(/\/$/, '');

// Rebuild the sitemap at most once an hour so new events and newsletters show up.
export const revalidate = 3600;

const STATIC_PATHS = [
  '',
  '/about',
  '/brotherhood',
  '/service',
  '/recruitment',
  '/events',
  '/newsletter',
  '/mentorship',
  '/legacy-vault',
  '/get-involved',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, newsletters] = await Promise.all([getEvents().catch(() => []), getNewsletters().catch(() => [])]);

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 })),
    ...events.map((event) => ({ url: `${SITE_URL}/events/${event.slug}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...newsletters.map((issue) => ({ url: `${SITE_URL}/newsletter/${issue.slug}`, changeFrequency: 'yearly' as const, priority: 0.4 })),
  ];
}
