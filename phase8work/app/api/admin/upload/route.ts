import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
]);
const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']);

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-');
}

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not connected. Add your keys before using Storage uploads.' }, { status: 400 });
  }

  const formData = await request.formData();
  const bucket = String(formData.get('bucket') || '').trim();
  const folder = String(formData.get('folder') || '').trim();
  const file = formData.get('file');

  if (!bucket) return NextResponse.json({ error: 'Bucket is required.' }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: 'A file is required.' }, { status: 400 });

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF, PDF, MP4, MOV, WEBM, and AVI files are allowed.' }, { status: 400 });
  }

  const isVideo = VIDEO_MIME_TYPES.has(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File is too large. Maximum size is ${Math.floor(maxSize / (1024 * 1024))} MB.` }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFilename(file.name || 'upload');
  const storagePath = `${folder ? `${folder.replace(/^\/+|\/+$/g, '')}/` : ''}${randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType: file.type || 'application/octet-stream',
    upsert: true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return NextResponse.json({
    message: 'File uploaded successfully.',
    storageBucket: bucket,
    storagePath,
    fileUrl: data.publicUrl,
  });
}
