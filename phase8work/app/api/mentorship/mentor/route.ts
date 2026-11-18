import { NextResponse } from 'next/server';
import { mentorSchema } from '@/lib/validations/forms';
import { persistMentorApplication } from '@/lib/actions/persist';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`mentor-signup:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions. Please wait a while and try again.' }, { status: 429 });
  }

  const json = await request.json();
  const result = mentorSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistMentorApplication(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save mentor application.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'Mentor application saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.'
  });
}
