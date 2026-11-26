import { NextResponse } from 'next/server';
import type { ZodType } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteDemoRecord } from '@/lib/demo-store';

type AdminPersistResult = { persisted: boolean; mode: 'supabase' | 'demo'; error?: string };

export type AdminCrudConfig<TInput> = {
  schema: ZodType<TInput>;
  invalidPayloadError: string;
  getRecords: () => Promise<unknown[]>;
  create: (input: TInput) => Promise<AdminPersistResult>;
  update: (id: string, input: TInput) => Promise<AdminPersistResult>;
  createdMessage: { supabase: string; demo: string };
  updatedMessage: { supabase: string; demo: string };
  deleteRecord: (supabase: SupabaseClient, id: string) => Promise<{ error: string | null }>;
  demoTable: Parameters<typeof deleteDemoRecord>[0];
  deletedMessage: string;
};

/**
 * Shared GET/POST/PUT/DELETE shape for the admin resource routes
 * (events, media, newsletters, alumni): session check, schema validation,
 * demo/supabase persistence, uniform response envelope. Each route supplies
 * its own schema, persistence functions, and messages.
 */
export function createAdminCrudHandlers<TInput>(config: AdminCrudConfig<TInput>) {
  async function GET() {
    const session = await requireSession('admin');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const rows = await config.getRecords();
    return NextResponse.json({ rows });
  }

  async function POST(request: Request) {
    const session = await requireSession('admin');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const json = await request.json().catch(() => null);
    const parsed = config.schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: config.invalidPayloadError }, { status: 400 });

    const result = await config.create(parsed.data);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({
      message: result.mode === 'demo' ? config.createdMessage.demo : config.createdMessage.supabase,
    });
  }

  async function PUT(request: Request) {
    const session = await requireSession('admin');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

    const json = await request.json().catch(() => null);
    const parsed = config.schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: config.invalidPayloadError }, { status: 400 });

    const result = await config.update(id, parsed.data);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    return NextResponse.json({
      message: result.mode === 'demo' ? config.updatedMessage.demo : config.updatedMessage.supabase,
    });
  }

  async function DELETE(request: Request) {
    const session = await requireSession('admin');
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      await deleteDemoRecord(config.demoTable, id);
      return NextResponse.json({ message: 'Deleted (demo mode).' });
    }

    const { error } = await config.deleteRecord(supabase, id);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ message: config.deletedMessage });
  }

  return { GET, POST, PUT, DELETE };
}
