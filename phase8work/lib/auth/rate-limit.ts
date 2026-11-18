const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter. Works per-instance on Vercel serverless —
 * good enough to block sustained brute-force within a single instance lifetime.
 * Returns true if the request is allowed, false if it should be blocked.
 */
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

export function clearRateLimit(key: string) {
  attempts.delete(key);
}

/**
 * Best-effort client IP for rate limiting. On Vercel, x-real-ip and the first
 * x-forwarded-for hop are set by the platform and can't be spoofed by the
 * client. CF-Connecting-IP is deliberately ignored: the site is not behind
 * Cloudflare, so that header is fully attacker controlled.
 */
export function getClientIp(request: Request): string {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}
