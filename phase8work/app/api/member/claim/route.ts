import { NextResponse } from 'next/server';
import { memberClaimRequestSchema } from '@/lib/validations/member';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { issueClaimToken } from '@/lib/auth/active-claim';
import { sendAlumniClaimEmail } from '@/lib/email/send-alumni-claim-email';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limit';

type AlumniPrivateDetailsLookup = {
  alumni_profile_id: string;
  email: string;
  alumni_profiles:
    | { full_name: string; graduation_year: number | null; member_status: string | null; alumni_access_enabled: boolean | null }
    | { full_name: string; graduation_year: number | null; member_status: string | null; alumni_access_enabled: boolean | null }[]
    | null;
};

const GENERIC_MESSAGE = 'If that name, graduation year, and email match an alumni record, we sent a secure setup link to that email.';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`member-claim-request:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many setup requests. Please wait 10 minutes.' }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = memberClaimRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter your full name, graduation year, and email.' }, { status: 400 });
  }

  const { fullName, graduationYear, email } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  if (!checkRateLimit(`member-claim-request-email:${normalizedEmail}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many setup requests for this email. Please wait 10 minutes.' }, { status: 429 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const lookup = await supabase
      .from('alumni_private_details')
      .select('alumni_profile_id, email, alumni_profiles(full_name, graduation_year, member_status, alumni_access_enabled)')
      .eq('email', normalizedEmail)
      .maybeSingle();

    const lookupData = lookup.data as AlumniPrivateDetailsLookup | null;
    const profile = Array.isArray(lookupData?.alumni_profiles)
      ? lookupData?.alumni_profiles?.[0]
      : lookupData?.alumni_profiles;

    const isEligible =
      Boolean(lookupData?.alumni_profile_id) &&
      profile != null &&
      profile.full_name === fullName &&
      Number(profile.graduation_year) === graduationYear &&
      profile.alumni_access_enabled !== false &&
      profile.member_status !== 'active';

    if (!isEligible) {
      return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
    }

    const issued = await issueClaimToken({
      claimType: 'alumni',
      email: normalizedEmail,
      alumniProfileId: lookup.data!.alumni_profile_id
    });

    const delivery = await sendAlumniClaimEmail({
      to: normalizedEmail,
      claimUrl: issued.url,
      expiresAt: issued.expiresAt
    });

    if (!delivery.sent) {
      if (delivery.mode === 'preview' && process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          ok: true,
          message: 'Resend is not configured, so no email was sent. Use the preview link below for local testing.',
          previewUrl: issued.url
        });
      }

      return NextResponse.json({ error: delivery.error || 'Unable to send the setup email.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unable to start account setup.'
    }, { status: 500 });
  }
}
