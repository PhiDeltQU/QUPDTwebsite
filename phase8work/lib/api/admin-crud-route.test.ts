import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import type { SessionUser } from '@/types';

const requireSessionMock = vi.fn<() => Promise<SessionUser | null>>();
const createServerSupabaseClientMock = vi.fn<() => unknown>();
const deleteDemoRecordMock = vi.fn<(table: string, id: string) => Promise<void>>();

vi.mock('@/lib/auth/session', () => ({
  requireSession: () => requireSessionMock(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => createServerSupabaseClientMock(),
}));

vi.mock('@/lib/demo-store', () => ({
  deleteDemoRecord: (table: string, id: string) => deleteDemoRecordMock(table, id),
}));

const adminSession: SessionUser = { role: 'admin', email: 'admin@example.edu', name: 'Admin', expiresAt: Date.now() + 1000 };

const schema = z.object({ title: z.string() });

function buildConfig(overrides: Partial<Parameters<typeof import('./admin-crud-route').createAdminCrudHandlers>[0]> = {}) {
  return {
    schema,
    invalidPayloadError: 'Invalid payload.',
    getRecords: vi.fn().mockResolvedValue([{ id: '1' }]),
    create: vi.fn().mockResolvedValue({ persisted: true, mode: 'supabase' as const }),
    update: vi.fn().mockResolvedValue({ persisted: true, mode: 'supabase' as const }),
    createdMessage: { supabase: 'Created.', demo: 'Created (demo).' },
    updatedMessage: { supabase: 'Updated.', demo: 'Updated (demo).' },
    deleteRecord: vi.fn().mockResolvedValue({ error: null }),
    demoTable: 'events' as const,
    deletedMessage: 'Deleted.',
    ...overrides,
  };
}

describe('createAdminCrudHandlers', () => {
  beforeEach(() => {
    requireSessionMock.mockReset().mockResolvedValue(adminSession);
    createServerSupabaseClientMock.mockReset().mockReturnValue({});
    deleteDemoRecordMock.mockReset();
    vi.resetModules();
  });

  it('GET returns 401 when there is no session', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    requireSessionMock.mockResolvedValue(null);
    const { GET } = createAdminCrudHandlers(buildConfig());
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('GET returns the records from getRecords when authorized', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    const config = buildConfig();
    const { GET } = createAdminCrudHandlers(config);
    const res = await GET();
    const body = await res.json();
    expect(body.rows).toEqual([{ id: '1' }]);
    expect(config.getRecords).toHaveBeenCalled();
  });

  it('POST returns 400 on a payload that fails schema validation', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    const config = buildConfig();
    const { POST } = createAdminCrudHandlers(config);
    const req = new Request('http://localhost/api/admin/events', { method: 'POST', body: JSON.stringify({}) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(config.create).not.toHaveBeenCalled();
  });

  it('POST picks the demo message when create() reports demo mode', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    const config = buildConfig({ create: vi.fn().mockResolvedValue({ persisted: true, mode: 'demo' as const }) });
    const { POST } = createAdminCrudHandlers(config);
    const req = new Request('http://localhost/api/admin/events', { method: 'POST', body: JSON.stringify({ title: 'x' }) });
    const res = await POST(req);
    const body = await res.json();
    expect(body.message).toBe('Created (demo).');
  });

  it('POST returns 500 and the underlying error when create() fails', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    const config = buildConfig({
      create: vi.fn().mockResolvedValue({ persisted: false, mode: 'supabase' as const, error: 'db exploded' }),
    });
    const { POST } = createAdminCrudHandlers(config);
    const req = new Request('http://localhost/api/admin/events', { method: 'POST', body: JSON.stringify({ title: 'x' }) });
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('db exploded');
  });

  it('PUT requires an id query param', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    const { PUT } = createAdminCrudHandlers(buildConfig());
    const req = new Request('http://localhost/api/admin/events', { method: 'PUT', body: JSON.stringify({ title: 'x' }) });
    const res = await PUT(req);
    expect(res.status).toBe(400);
  });

  it('DELETE uses the demo-store fallback when Supabase is not configured', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    createServerSupabaseClientMock.mockReturnValue(null);
    const config = buildConfig();
    const { DELETE } = createAdminCrudHandlers(config);
    const req = new Request('http://localhost/api/admin/events?id=42', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(deleteDemoRecordMock).toHaveBeenCalledWith('events', '42');
    expect(config.deleteRecord).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it('DELETE calls the resource deleteRecord and reports its deletedMessage when Supabase is configured', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    const fakeSupabase = {};
    createServerSupabaseClientMock.mockReturnValue(fakeSupabase);
    const config = buildConfig();
    const { DELETE } = createAdminCrudHandlers(config);
    const req = new Request('http://localhost/api/admin/events?id=42', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(config.deleteRecord).toHaveBeenCalledWith(fakeSupabase, '42');
    const body = await res.json();
    expect(body.message).toBe('Deleted.');
  });

  it('DELETE returns 500 when deleteRecord reports an error', async () => {
    const { createAdminCrudHandlers } = await import('./admin-crud-route');
    createServerSupabaseClientMock.mockReturnValue({});
    const config = buildConfig({ deleteRecord: vi.fn().mockResolvedValue({ error: 'cannot delete' }) });
    const { DELETE } = createAdminCrudHandlers(config);
    const req = new Request('http://localhost/api/admin/events?id=42', { method: 'DELETE' });
    const res = await DELETE(req);
    expect(res.status).toBe(500);
  });
});
