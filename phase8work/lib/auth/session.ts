import crypto from 'crypto';
import { cookies } from 'next/headers';
import { SessionRole, SessionUser } from '@/types';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { isAdminEmail } from '@/lib/auth/admin-users';

const DEFAULT_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set. Refusing to sign or verify sessions with an insecure default.');
  }
  return secret;
}

function encode(payload: SessionUser) {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json).toString('base64url');
  const signature = crypto.createHmac('sha256', getSessionSecret()).update(body).digest('base64url');
  return `${body}.${signature}`;
}

function decode(token: string): SessionUser | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  if (!body || !signature) return null;

  const expected = crypto.createHmac('sha256', getSessionSecret()).update(body).digest('base64url');
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionUser;
    if (!parsed?.role || !parsed?.email || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionToken(input: { role: SessionRole; email: string; name?: string; expiresInMs?: number }) {
  return encode({
    role: input.role,
    email: input.email,
    name: input.name || input.email,
    expiresAt: Date.now() + (input.expiresInMs ?? DEFAULT_DURATION_MS)
  });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function requireSession(role?: SessionRole) {
  const session = await getSessionUser();
  if (!session) return null;
  if (role && session.role !== role) return null;
  // Admin sessions are re-checked against admin_users on every request, so
  // removing someone on the Admins page signs them out right away.
  if (session.role === 'admin' && !(await isAdminEmail(session.email))) return null;
  return session;
}
