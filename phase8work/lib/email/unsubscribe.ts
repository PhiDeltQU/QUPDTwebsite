import crypto from 'crypto';

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error('SESSION_SECRET is required to build unsubscribe links.');
  return value;
}

export function unsubscribeToken(email: string) {
  return crypto
    .createHmac('sha256', secret())
    .update(`unsubscribe:${email.trim().toLowerCase()}`)
    .digest('base64url');
}

export function verifyUnsubscribeToken(email: string, token: string) {
  const expected = Buffer.from(unsubscribeToken(email));
  const given = Buffer.from(token);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

export function siteBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://ctepsilonphidelts.org').replace(/\/$/, '');
}

export function unsubscribeUrl(email: string) {
  const params = new URLSearchParams({ email: email.trim().toLowerCase(), token: unsubscribeToken(email) });
  return `${siteBaseUrl()}/api/newsletter/unsubscribe?${params.toString()}`;
}
