import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

type ChainResult = { data?: unknown; error?: { message: string } | null };

function makeChain(result: ChainResult) {
  const chain: Record<string, unknown> = {};
  for (const method of ['select', 'ilike', 'limit', 'eq']) {
    chain[method] = () => chain;
  }
  (chain as { then: Promise<ChainResult>['then'] }).then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return chain;
}

function makeFakeSupabase(result: ChainResult) {
  return { from: () => makeChain(result) };
}

const createServerSupabaseClientMock = vi.fn<() => unknown>();

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => createServerSupabaseClientMock(),
}));

let savedVercel: string | undefined;

beforeEach(() => {
  createServerSupabaseClientMock.mockReset();
  savedVercel = process.env.VERCEL;
  delete process.env.VERCEL;
  vi.resetModules();
});

afterEach(() => {
  if (savedVercel === undefined) delete process.env.VERCEL;
  else process.env.VERCEL = savedVercel;
});

describe('demoAdminAllowed', () => {
  it('is true when VERCEL is not set (local dev)', async () => {
    const { demoAdminAllowed } = await import('./admin-users');
    expect(demoAdminAllowed()).toBe(true);
  });

  it('is false when VERCEL=1 (a real deployment, never fall back to demo mode there)', async () => {
    process.env.VERCEL = '1';
    const { demoAdminAllowed } = await import('./admin-users');
    expect(demoAdminAllowed()).toBe(false);
  });
});

describe('lookupAdminEmail', () => {
  it('returns no-database when Supabase is not configured', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    const { lookupAdminEmail } = await import('./admin-users');
    await expect(lookupAdminEmail('someone@example.edu')).resolves.toBe('no-database');
  });

  it('returns allowed when the email is found in admin_users', async () => {
    createServerSupabaseClientMock.mockReturnValue(makeFakeSupabase({ data: [{ email: 'admin@example.edu' }], error: null }));
    const { lookupAdminEmail } = await import('./admin-users');
    await expect(lookupAdminEmail('admin@example.edu')).resolves.toBe('allowed');
  });

  it('returns denied when the email is not found', async () => {
    createServerSupabaseClientMock.mockReturnValue(makeFakeSupabase({ data: [], error: null }));
    const { lookupAdminEmail } = await import('./admin-users');
    await expect(lookupAdminEmail('nobody@example.edu')).resolves.toBe('denied');
  });

  it('fails closed (denied) on a database error, never leaking through as allowed', async () => {
    createServerSupabaseClientMock.mockReturnValue(makeFakeSupabase({ data: null, error: { message: 'db down' } }));
    const { lookupAdminEmail } = await import('./admin-users');
    await expect(lookupAdminEmail('admin@example.edu')).resolves.toBe('denied');
  });
});

describe('isAdminEmail', () => {
  it('falls back to demoAdminAllowed() when there is no database (local dev)', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    const { isAdminEmail } = await import('./admin-users');
    await expect(isAdminEmail('anyone@example.edu')).resolves.toBe(true);
  });

  it('never allows demo fallback on a real Vercel deployment even with no database configured', async () => {
    process.env.VERCEL = '1';
    createServerSupabaseClientMock.mockReturnValue(null);
    const { isAdminEmail } = await import('./admin-users');
    await expect(isAdminEmail('anyone@example.edu')).resolves.toBe(false);
  });

  it('reflects the real allow-list result when a database is configured', async () => {
    createServerSupabaseClientMock.mockReturnValue(makeFakeSupabase({ data: [], error: null }));
    const { isAdminEmail } = await import('./admin-users');
    await expect(isAdminEmail('removed-admin@example.edu')).resolves.toBe(false);
  });
});
