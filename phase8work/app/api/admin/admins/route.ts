import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const addAdminSchema = z.object({
  email: z.email().max(254),
  fullName: z.string().trim().max(120).optional().or(z.literal('')),
});

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'The database is not connected, so admins cannot be added in demo mode.' }, { status: 400 });

  const parsed = addAdminSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  const { data: existing } = await supabase.from('admin_users').select('id').ilike('email', email.replace(/[\%_]/g, (m) => `\${m}`)).limit(1);
  if (existing && existing.length > 0) return NextResponse.json({ error: `${email} is already an admin.` }, { status: 400 });

  const { error } = await supabase.from('admin_users').insert({ email, full_name: parsed.data.fullName || null });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: `${email} is now an admin. Give them the admin password so they can sign in.` });
}

export async function DELETE(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'The database is not connected.' }, { status: 400 });

  const id = new URL(request.url).searchParams.get('id') || '';
  if (!id) return NextResponse.json({ error: 'Missing admin id.' }, { status: 400 });

  const { data: admins, error: listError } = await supabase.from('admin_users').select('id, email');
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  const target = (admins || []).find((row) => row.id === id);
  if (!target) return NextResponse.json({ error: 'That admin was not found.' }, { status: 404 });
  if ((target.email || '').toLowerCase() === session.email.toLowerCase()) {
    return NextResponse.json({ error: 'You cannot remove yourself. Ask another admin to do it.' }, { status: 400 });
  }
  if ((admins || []).length <= 1) {
    return NextResponse.json({ error: 'You cannot remove the last admin.' }, { status: 400 });
  }

  const { error } = await supabase.from('admin_users').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: `${target.email} was removed and signed out.` });
}
