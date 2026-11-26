import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AdminAlumniInput, AdminEventInput, AdminMediaInput, AdminNewsletterInput } from '@/lib/validations/admin';

type ChainResult = { data?: unknown; error?: { message: string } | null };

function makeChain(result: ChainResult) {
  const chain: Record<string, unknown> = {};
  for (const method of ['insert', 'update', 'upsert', 'select', 'eq', 'maybeSingle', 'delete', 'limit', 'ilike']) {
    chain[method] = () => chain;
  }
  (chain as { then: Promise<ChainResult>['then'] }).then = (resolve, reject) => Promise.resolve(result).then(resolve, reject);
  return chain;
}

function makeFakeSupabase(tableResults: Record<string, ChainResult | ChainResult[]>) {
  const callCounts: Record<string, number> = {};
  return {
    from(table: string) {
      const entry = tableResults[table];
      let result: ChainResult;
      if (Array.isArray(entry)) {
        const idx = callCounts[table] ?? 0;
        result = entry[Math.min(idx, entry.length - 1)];
        callCounts[table] = idx + 1;
      } else {
        result = entry ?? { data: null, error: null };
      }
      return makeChain(result);
    },
  };
}

const createServerSupabaseClientMock = vi.fn<() => unknown>();

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => createServerSupabaseClientMock(),
}));

const demoStoreMock = {
  createDemoAlumni: vi.fn(),
  createDemoEvent: vi.fn(),
  createDemoMedia: vi.fn(),
  createDemoNewsletter: vi.fn(),
  importDemoAlumni: vi.fn(),
  updateDemoAlumni: vi.fn(),
  updateDemoEvent: vi.fn(),
  updateDemoPageContent: vi.fn(),
  updateDemoMedia: vi.fn(),
  updateDemoNewsletter: vi.fn(),
};

vi.mock('@/lib/demo-store', () => demoStoreMock);

function baseEventInput(overrides: Partial<AdminEventInput> = {}): AdminEventInput {
  return {
    title: 'Founders Day',
    slug: 'founders-day',
    eventDate: '2027-04-01',
    eventTime: '6:00 PM',
    location: 'Chapter House',
    audience: 'Brothers',
    description: 'A description that is long enough.',
    bodyContent: 'Body content that is long enough.',
    tags: 'tag1, tag2',
    isFeatured: false,
    status: 'published',
    ...overrides,
  };
}

function baseNewsletterInput(overrides: Partial<AdminNewsletterInput> = {}): AdminNewsletterInput {
  return {
    title: 'Spring Update',
    slug: 'spring-update',
    category: 'General',
    issueDate: '2027-04',
    subjectLine: 'Spring chapter update',
    summary: 'A short summary of this issue.',
    bodyContent: 'Body content that is long enough.',
    status: 'draft',
    isFeatured: false,
    ...overrides,
  };
}

function baseMediaInput(overrides: Partial<AdminMediaInput> = {}): AdminMediaInput {
  return {
    title: 'Formal Photo',
    mediaType: 'photo',
    yearLabel: '2027',
    caption: 'Formal event',
    fileUrl: 'https://example.com/photo.jpg',
    storageBucket: 'site-images',
    storagePath: 'formal/photo.jpg',
    ...overrides,
  };
}

function baseAlumniInput(overrides: Partial<AdminAlumniInput> = {}): AdminAlumniInput {
  return {
    fullName: 'Jane Brother',
    graduationYear: 2015,
    graduationTerm: 'spring',
    memberStatus: 'alumni',
    alumniAccessEnabled: true,
    major: 'Economics',
    company: 'Acme Corp',
    jobTitle: 'Analyst',
    industry: 'Finance',
    location: 'Boston, MA',
    shortBio: 'A short bio that is long enough to pass validation.',
    linkedinUrl: '',
    email: '',
    phone: '',
    bondNumber: '',
    willingToMentor: false,
    isPublic: true,
    isFeatured: false,
    ...overrides,
  };
}

beforeEach(() => {
  createServerSupabaseClientMock.mockReset();
  for (const fn of Object.values(demoStoreMock)) fn.mockReset();
  vi.resetModules();
});

describe('persistAdminEvent / updateAdminEvent', () => {
  it('demo mode: persistAdminEvent delegates to createDemoEvent', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    const { persistAdminEvent } = await import('./admin-persist');
    const input = baseEventInput();
    const result = await persistAdminEvent(input);
    expect(result).toEqual({ persisted: true, mode: 'demo' });
    expect(demoStoreMock.createDemoEvent).toHaveBeenCalledWith(input);
  });

  it('demo mode: updateAdminEvent returns not-found when updateDemoEvent returns falsy', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    demoStoreMock.updateDemoEvent.mockResolvedValue(null);
    const { updateAdminEvent } = await import('./admin-persist');
    const result = await updateAdminEvent('missing-id', baseEventInput());
    expect(result).toEqual({ persisted: false, mode: 'demo', error: 'Record not found.' });
  });

  it('demo mode: updateAdminEvent succeeds when updateDemoEvent returns a record', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    demoStoreMock.updateDemoEvent.mockResolvedValue({ id: 'e1' });
    const { updateAdminEvent } = await import('./admin-persist');
    const result = await updateAdminEvent('e1', baseEventInput());
    expect(result).toEqual({ persisted: true, mode: 'demo' });
  });

  it('supabase mode: persistAdminEvent inserts into the events table with mapped fields', async () => {
    const supabase = makeFakeSupabase({ events: { error: null } });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { persistAdminEvent } = await import('./admin-persist');
    const result = await persistAdminEvent(baseEventInput({ tags: 'a, b ,c' }));
    expect(result).toEqual({ persisted: true, mode: 'supabase' });
  });

  it('supabase mode: persistAdminEvent surfaces the insert error', async () => {
    const supabase = makeFakeSupabase({ events: { error: { message: 'insert failed' } } });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { persistAdminEvent } = await import('./admin-persist');
    const result = await persistAdminEvent(baseEventInput());
    expect(result).toEqual({ persisted: false, mode: 'supabase', error: 'insert failed' });
  });

  it('supabase mode: updateAdminEvent surfaces the update error', async () => {
    const supabase = makeFakeSupabase({ events: { error: { message: 'update failed' } } });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { updateAdminEvent } = await import('./admin-persist');
    const result = await updateAdminEvent('e1', baseEventInput());
    expect(result).toEqual({ persisted: false, mode: 'supabase', error: 'update failed' });
  });
});

describe('persistAdminNewsletter / updateAdminNewsletter', () => {
  it('demo mode create and update', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    demoStoreMock.updateDemoNewsletter.mockResolvedValue({ id: 'n1' });
    const { persistAdminNewsletter, updateAdminNewsletter } = await import('./admin-persist');
    const input = baseNewsletterInput();
    await expect(persistAdminNewsletter(input)).resolves.toEqual({ persisted: true, mode: 'demo' });
    expect(demoStoreMock.createDemoNewsletter).toHaveBeenCalledWith(input);
    await expect(updateAdminNewsletter('n1', input)).resolves.toEqual({ persisted: true, mode: 'demo' });
  });

  it('supabase mode: inserts into newsletters and surfaces errors', async () => {
    const supabaseOk = makeFakeSupabase({ newsletters: { error: null } });
    createServerSupabaseClientMock.mockReturnValue(supabaseOk);
    const { persistAdminNewsletter } = await import('./admin-persist');
    await expect(persistAdminNewsletter(baseNewsletterInput())).resolves.toEqual({ persisted: true, mode: 'supabase' });

    vi.resetModules();
    const supabaseErr = makeFakeSupabase({ newsletters: { error: { message: 'dupe slug' } } });
    createServerSupabaseClientMock.mockReturnValue(supabaseErr);
    const { persistAdminNewsletter: persistAgain } = await import('./admin-persist');
    await expect(persistAgain(baseNewsletterInput())).resolves.toEqual({
      persisted: false,
      mode: 'supabase',
      error: 'dupe slug',
    });
  });
});

describe('persistAdminMedia / updateAdminMedia', () => {
  it('demo mode create and update', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    demoStoreMock.updateDemoMedia.mockResolvedValue(null);
    const { persistAdminMedia, updateAdminMedia } = await import('./admin-persist');
    const input = baseMediaInput();
    await expect(persistAdminMedia(input)).resolves.toEqual({ persisted: true, mode: 'demo' });
    expect(demoStoreMock.createDemoMedia).toHaveBeenCalledWith(input);
    await expect(updateAdminMedia('missing', input)).resolves.toEqual({
      persisted: false,
      mode: 'demo',
      error: 'Record not found.',
    });
  });

  it('supabase mode: updates the media_items table', async () => {
    const supabase = makeFakeSupabase({ media_items: { error: null } });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { updateAdminMedia } = await import('./admin-persist');
    await expect(updateAdminMedia('m1', baseMediaInput())).resolves.toEqual({ persisted: true, mode: 'supabase' });
  });
});

describe('persistAdminAlumni / updateAdminAlumni (two-table writes)', () => {
  it('demo mode delegates to createDemoAlumni', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    const { persistAdminAlumni } = await import('./admin-persist');
    const input = baseAlumniInput();
    await expect(persistAdminAlumni(input)).resolves.toEqual({ persisted: true, mode: 'demo' });
    expect(demoStoreMock.createDemoAlumni).toHaveBeenCalledWith(input);
  });

  it('supabase mode: skips the private-details insert when no email/phone/bondNumber given', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: { data: { id: 'p1' }, error: null },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { persistAdminAlumni } = await import('./admin-persist');
    const result = await persistAdminAlumni(baseAlumniInput());
    expect(result).toEqual({ persisted: true, mode: 'supabase' });
  });

  it('supabase mode: inserts private details when email is given, and surfaces a details-insert error', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: { data: { id: 'p1' }, error: null },
      alumni_private_details: { error: { message: 'details insert failed' } },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { persistAdminAlumni } = await import('./admin-persist');
    const result = await persistAdminAlumni(baseAlumniInput({ email: 'alum@example.edu' }));
    expect(result).toEqual({ persisted: false, mode: 'supabase', error: 'details insert failed' });
  });

  it('supabase mode: profile insert failure never attempts the private-details insert', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: { data: null, error: { message: 'profile insert failed' } },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { persistAdminAlumni } = await import('./admin-persist');
    const result = await persistAdminAlumni(baseAlumniInput({ email: 'alum@example.edu' }));
    expect(result).toEqual({ persisted: false, mode: 'supabase', error: 'profile insert failed' });
  });

  it('demo mode: updateAdminAlumni reports not-found when the record is missing', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    demoStoreMock.updateDemoAlumni.mockResolvedValue(null);
    const { updateAdminAlumni } = await import('./admin-persist');
    const result = await updateAdminAlumni('missing', baseAlumniInput());
    expect(result).toEqual({ persisted: false, mode: 'demo', error: 'Record not found.' });
  });

  it('supabase mode: updateAdminAlumni upserts private details after a successful profile update', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: { error: null },
      alumni_private_details: { error: null },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { updateAdminAlumni } = await import('./admin-persist');
    const result = await updateAdminAlumni('p1', baseAlumniInput({ email: 'alum@example.edu' }));
    expect(result).toEqual({ persisted: true, mode: 'supabase' });
  });

  it('supabase mode: updateAdminAlumni stops at the profile-update error and never upserts details', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: { error: { message: 'profile update failed' } },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { updateAdminAlumni } = await import('./admin-persist');
    const result = await updateAdminAlumni('p1', baseAlumniInput());
    expect(result).toEqual({ persisted: false, mode: 'supabase', error: 'profile update failed' });
  });
});

describe('importAdminAlumni', () => {
  it('demo mode delegates to importDemoAlumni and reports its count', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    demoStoreMock.importDemoAlumni.mockResolvedValue({ count: 3 });
    const { importAdminAlumni } = await import('./admin-persist');
    const records = [baseAlumniInput()];
    const result = await importAdminAlumni(records);
    expect(result).toEqual({ persisted: true, mode: 'demo', count: 3 });
    expect(demoStoreMock.importDemoAlumni).toHaveBeenCalledWith(records);
  });

  it('creates a brand-new profile when neither email nor name+grad-year match an existing record', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: [{ data: null, error: null }, { data: { id: 'new-id' }, error: null }],
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { importAdminAlumni } = await import('./admin-persist');
    const result = await importAdminAlumni([baseAlumniInput({ email: '' })]);
    expect(result).toEqual({ persisted: true, mode: 'supabase', count: 1 });
  });

  it('matches an existing profile by email and updates it instead of creating a duplicate', async () => {
    const supabase = makeFakeSupabase({
      alumni_private_details: [
        { data: { alumni_profile_id: 'existing-id' }, error: null },
        { error: null },
      ],
      alumni_profiles: { error: null },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { importAdminAlumni } = await import('./admin-persist');
    const result = await importAdminAlumni([baseAlumniInput({ email: 'alum@example.edu' })]);
    expect(result).toEqual({ persisted: true, mode: 'supabase', count: 1 });
  });

  it('falls back to name+graduation-year matching when no email is given', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: [{ data: { id: 'matched-by-name' }, error: null }, { error: null }],
      alumni_private_details: { error: null },
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { importAdminAlumni } = await import('./admin-persist');
    const result = await importAdminAlumni([baseAlumniInput({ email: '' })]);
    expect(result).toEqual({ persisted: true, mode: 'supabase', count: 1 });
  });

  it('stops the batch and reports no count when a row fails to persist', async () => {
    const supabase = makeFakeSupabase({
      alumni_profiles: [{ data: null, error: null }, { data: null, error: { message: 'insert failed' } }],
    });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { importAdminAlumni } = await import('./admin-persist');
    const result = await importAdminAlumni([baseAlumniInput({ email: '' })]);
    expect(result).toEqual({ persisted: false, mode: 'supabase', error: 'insert failed', count: undefined });
  });
});

describe('updatePageContent', () => {
  it('demo mode delegates to updateDemoPageContent', async () => {
    createServerSupabaseClientMock.mockReturnValue(null);
    const { updatePageContent } = await import('./admin-persist');
    const values = { heading: 'New heading' };
    await expect(updatePageContent('about', values)).resolves.toEqual({ persisted: true, mode: 'demo' });
    expect(demoStoreMock.updateDemoPageContent).toHaveBeenCalledWith('about', values);
  });

  it('supabase mode: upserts into site_content and short-circuits on an empty values object', async () => {
    const supabase = makeFakeSupabase({ site_content: { error: null } });
    createServerSupabaseClientMock.mockReturnValue(supabase);
    const { updatePageContent } = await import('./admin-persist');
    await expect(updatePageContent('about', {})).resolves.toEqual({ persisted: true, mode: 'supabase' });
    await expect(updatePageContent('about', { heading: 'Hi' })).resolves.toEqual({ persisted: true, mode: 'supabase' });
  });
});
