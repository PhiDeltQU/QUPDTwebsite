import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireSession } from '@/lib/auth/session';
import { updatePageContent } from '@/lib/actions/admin-persist';
import { getPageDefinition, pageFields } from '@/lib/content/registry';

const MAX_LENGTH = 6000;
const SAFE_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/i;

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Your admin session ended. Sign in again.' }, { status: 401 });

  const { slug } = await params;
  const definition = getPageDefinition(slug);
  if (!definition) return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });

  const body = (await request.json().catch(() => null)) as { values?: Record<string, unknown> } | null;
  if (!body?.values || typeof body.values !== 'object') {
    return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
  }

  const fields = new Map(pageFields(definition).map((field) => [field.key, field]));
  const clean: Record<string, string> = {};

  for (const [key, raw] of Object.entries(body.values)) {
    const field = fields.get(key);
    if (!field) continue;
    if (typeof raw !== 'string') return NextResponse.json({ error: `"${field.label}" must be text.` }, { status: 400 });
    const value = raw.replace(/\r\n/g, '\n').trim();
    if (value.length > MAX_LENGTH) {
      return NextResponse.json({ error: `"${field.label}" is too long (limit ${MAX_LENGTH} characters).` }, { status: 400 });
    }
    if ((field.type === 'link' || field.type === 'image') && value && !SAFE_LINK.test(value)) {
      return NextResponse.json(
        { error: `"${field.label}" must start with / (a page on this site) or https:// (another website).` },
        { status: 400 },
      );
    }
    if (field.type === 'toggle' && value !== 'yes' && value !== 'no') {
      return NextResponse.json({ error: `"${field.label}" must be on or off.` }, { status: 400 });
    }
    clean[key] = value;
  }

  const result = await updatePageContent(slug, clean);
  if (result.error) return NextResponse.json({ error: `Could not save: ${result.error}` }, { status: 500 });

  // Content shows up on every page (header, footer), so refresh the whole site.
  revalidatePath('/', 'layout');

  return NextResponse.json({
    message: result.mode === 'demo' ? 'Saved (local demo mode).' : 'Saved. Your changes are live.',
  });
}
