import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const BUCKET = 'site-images';
const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

/** Uploads a photo for the page editor and returns its public link. */
export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Your admin session ended. Sign in again.' }, { status: 401 });

  const supabase = createServerSupabaseClient();
  if (!supabase) return NextResponse.json({ error: 'Photo uploads need the live database. Paste an image link instead.' }, { status: 400 });

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'Choose a photo to upload.' }, { status: 400 });

  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ error: 'Photos must be JPG, PNG, WEBP, or GIF.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Photo is too large. The limit is 10 MB.' }, { status: 400 });

  // Create the public bucket the first time anyone uploads, so nobody has to set it up by hand.
  const { data: bucket } = await supabase.storage.getBucket(BUCKET);
  if (!bucket) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: MAX_BYTES, allowedMimeTypes: Object.keys(TYPES) });
    if (error && !/already exists/i.test(error.message)) {
      return NextResponse.json({ error: `Could not set up photo storage: ${error.message}` }, { status: 500 });
    }
  }

  const path = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
