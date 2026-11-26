import { describe, it, expect, beforeEach, afterEach } from 'vitest';

const ENV_KEYS = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;
let saved: Record<string, string | undefined>;

describe('createServerSupabaseClient', () => {
  beforeEach(() => {
    saved = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
    for (const key of ENV_KEYS) delete process.env[key];
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it('returns null when no Supabase env vars are configured (demo mode)', async () => {
    const { createServerSupabaseClient } = await import('./server');
    expect(createServerSupabaseClient()).toBeNull();
  });

  it('returns null when only the URL is set without any key', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    const { createServerSupabaseClient } = await import('./server');
    expect(createServerSupabaseClient()).toBeNull();
  });

  it('builds a client when the URL and service-role key are present', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    const { createServerSupabaseClient } = await import('./server');
    expect(createServerSupabaseClient()).not.toBeNull();
  });

  it('falls back to the anon key when the service-role key is absent', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-test-key';
    const { createServerSupabaseClient } = await import('./server');
    expect(createServerSupabaseClient()).not.toBeNull();
  });
});
