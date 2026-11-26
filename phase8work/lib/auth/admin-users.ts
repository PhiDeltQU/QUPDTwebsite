import { cache } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { escapeLikePattern } from '@/lib/utils/escape-like';

export type AdminLookup = 'allowed' | 'denied' | 'no-database';

/**
 * Checks whether an email is listed in the admin_users table (case
 * insensitive). Returns 'no-database' when Supabase isn't configured at all
 * (local demo mode). Any database error counts as 'denied' so admin access
 * fails closed.
 */
export const lookupAdminEmail = cache(async (email: string): Promise<AdminLookup> => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return 'no-database';

  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .ilike('email', escapeLikePattern(email.trim()))
    .limit(1);

  if (error) {
    console.error('[lookupAdminEmail]', error.message);
    return 'denied';
  }

  return data && data.length > 0 ? 'allowed' : 'denied';
});

/** Demo mode (no database) is only allowed outside of Vercel deployments. */
export function demoAdminAllowed() {
  return process.env.VERCEL !== '1';
}

export async function isAdminEmail(email: string) {
  const result = await lookupAdminEmail(email);
  if (result === 'no-database') return demoAdminAllowed();
  return result === 'allowed';
}
