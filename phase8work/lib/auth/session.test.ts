import { describe, it, expect, vi, beforeEach } from 'vitest';

let cookieValue: string | undefined;
const isAdminEmailMock = vi.fn<(email: string) => Promise<boolean>>();

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (_name: string) => (cookieValue ? { value: cookieValue } : undefined),
  }),
}));

vi.mock('@/lib/auth/admin-users', () => ({
  isAdminEmail: (email: string) => isAdminEmailMock(email),
}));

describe('session', () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = 'test-secret-do-not-use-in-prod';
    cookieValue = undefined;
    isAdminEmailMock.mockReset();
    isAdminEmailMock.mockResolvedValue(true);
    vi.resetModules();
  });

  it('round-trips a valid session token', async () => {
    const { createSessionToken, getSessionUser } = await import('./session');
    cookieValue = createSessionToken({ role: 'admin', email: 'brother@example.edu' });
    const session = await getSessionUser();
    expect(session?.email).toBe('brother@example.edu');
    expect(session?.role).toBe('admin');
  });

  it('rejects a tampered token', async () => {
    const { createSessionToken, getSessionUser } = await import('./session');
    const token = createSessionToken({ role: 'admin', email: 'brother@example.edu' });
    const [body, signature] = token.split('.');
    cookieValue = `${body}.${signature.slice(0, -1)}${signature.at(-1) === 'a' ? 'b' : 'a'}`;
    const session = await getSessionUser();
    expect(session).toBeNull();
  });

  it('rejects an expired token', async () => {
    const { createSessionToken, getSessionUser } = await import('./session');
    cookieValue = createSessionToken({ role: 'admin', email: 'brother@example.edu', expiresInMs: -1000 });
    const session = await getSessionUser();
    expect(session).toBeNull();
  });

  it('requireSession rejects a role mismatch', async () => {
    const { createSessionToken, requireSession } = await import('./session');
    cookieValue = createSessionToken({ role: 'active', email: 'brother@example.edu' });
    const session = await requireSession('admin');
    expect(session).toBeNull();
  });

  it('requireSession re-checks admin emails against the admin list on every call', async () => {
    const { createSessionToken, requireSession } = await import('./session');
    cookieValue = createSessionToken({ role: 'admin', email: 'former-admin@example.edu' });
    isAdminEmailMock.mockResolvedValue(false);
    const session = await requireSession('admin');
    expect(session).toBeNull();
    expect(isAdminEmailMock).toHaveBeenCalledWith('former-admin@example.edu');
  });

  it('requireSession accepts a valid admin whose email is still allow-listed', async () => {
    const { createSessionToken, requireSession } = await import('./session');
    cookieValue = createSessionToken({ role: 'admin', email: 'current-admin@example.edu' });
    isAdminEmailMock.mockResolvedValue(true);
    const session = await requireSession('admin');
    expect(session?.email).toBe('current-admin@example.edu');
  });
});
