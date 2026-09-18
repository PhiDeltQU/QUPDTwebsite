import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

const CLAIM_TTL_MINUTES = 30;

export type ClaimType = 'active' | 'alumni';

type ClaimTokenRow = {
  id: string;
  claim_type: ClaimType;
  auth_email: string;
  alumni_profile_id: string;
  expires_at: string;
  used_at: string | null;
};

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createActiveClaimToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function buildActiveClaimUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}/active/claim/complete?token=${encodeURIComponent(token)}`;
}

export function buildAlumniClaimUrl(token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl.replace(/\/$/, '')}/member/claim/complete?token=${encodeURIComponent(token)}`;
}

export async function issueClaimToken(input: { claimType: ClaimType; email: string; alumniProfileId: string }) {
  const supabase = getSupabaseAdmin();
  const token = createActiveClaimToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + CLAIM_TTL_MINUTES * 60 * 1000).toISOString();

  await supabase
    .from('member_claim_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('claim_type', input.claimType)
    .eq('auth_email', input.email)
    .is('used_at', null);

  const { error } = await supabase.from('member_claim_tokens').insert({
    claim_type: input.claimType,
    auth_email: input.email,
    alumni_profile_id: input.alumniProfileId,
    token_hash: tokenHash,
    expires_at: expiresAt
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    token,
    expiresAt,
    url: input.claimType === 'alumni' ? buildAlumniClaimUrl(token) : buildActiveClaimUrl(token)
  };
}

export async function issueActiveClaimToken(input: { email: string; alumniProfileId: string }) {
  return issueClaimToken({ claimType: 'active', ...input });
}

export async function getClaimTokenRecord(claimType: ClaimType, token: string): Promise<ClaimTokenRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('member_claim_tokens')
    .select('id, claim_type, auth_email, alumni_profile_id, expires_at, used_at')
    .eq('claim_type', claimType)
    .eq('token_hash', hashToken(token))
    .maybeSingle();

  if (error || !data) return null;
  return data as ClaimTokenRow;
}

export async function getActiveClaimTokenRecord(token: string) {
  return getClaimTokenRecord('active', token);
}

export async function getAlumniClaimTokenRecord(token: string) {
  return getClaimTokenRecord('alumni', token);
}

export function isActiveClaimTokenUsable(record: Pick<ClaimTokenRow, 'expires_at' | 'used_at'> | null) {
  if (!record) return false;
  if (record.used_at) return false;
  return new Date(record.expires_at).getTime() > Date.now();
}

export async function consumeActiveClaimToken(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('member_claim_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', id)
    .is('used_at', null);

  if (error) {
    throw new Error(error.message);
  }
}
