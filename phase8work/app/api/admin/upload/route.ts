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

// Only these storage buckets can be written to from the admin Media page.
// legacy-vault: public archive photos, documents, and videos.
// site-images: photos used on the public pages (images only).
const ALLOWED_BUCKETS = new Set(['legacy-vault', 'site-images']);
const IMAGE_ONLY_BUCKETS = new Set(['site-images']);
const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

async function matchesDeclaredType(file: File) {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  switch (file.type) {
    case 'image/jpeg':
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case 'image/png':
      return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    case 'image/gif':
      return b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46;
    case 'image/webp':
      return b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
    case 'application/pdf':
      return b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46;
    default:
      return true;
  }
}

function sanitizeFolder(folder: string) {
  return folder
    .split('/')
    .map((part) => part.toLowerCase().replace(/[^a-z0-9_-]+/g, '-'))
    .filter((part) => part && part !== '-')
    .join('/');
}

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

  if (!ALLOWED_BUCKETS.has(bucket)) {
    return NextResponse.json({ error: 'Choose where the file goes: legacy-vault or site-images.' }, { status: 400 });
  }
  if (!(file instanceof File)) return NextResponse.json({ error: 'A file is required.' }, { status: 400 });

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF, PDF, MP4, MOV, WEBM, and AVI files are allowed.' }, { status: 400 });
  }

  if (IMAGE_ONLY_BUCKETS.has(bucket) && !IMAGE_MIME_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Website images must be JPG, PNG, WEBP, or GIF.' }, { status: 400 });
  }

  if (!(await matchesDeclaredType(file))) {
    return NextResponse.json({ error: 'That file does not match its type. Try saving or exporting it again.' }, { status: 400 });
  }

  const isVideo = VIDEO_MIME_TYPES.has(file.type);
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File is too large. Maximum size is ${Math.floor(maxSize / (1024 * 1024))} MB.` }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = sanitizeFilename(file.name || 'upload');
  const safeFolder = sanitizeFolder(folder);
  const storagePath = `${safeFolder ? `${safeFolder}/` : ''}${randomUUID()}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
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
