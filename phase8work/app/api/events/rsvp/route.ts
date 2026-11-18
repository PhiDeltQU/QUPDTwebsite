import { NextResponse } from 'next/server';
import { rsvpSchema } from '@/lib/validations/forms';
import { persistEventRsvp } from '@/lib/actions/persist';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`rsvp:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many RSVPs. Please wait a while and try again.' }, { status: 429 });
  }

  const json = await request.json();
  const result = rsvpSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistEventRsvp(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save RSVP.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'RSVP saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.'
  });
}
