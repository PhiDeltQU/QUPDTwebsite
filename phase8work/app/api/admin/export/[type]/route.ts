import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { toCsv } from '@/lib/utils/csv';

export const runtime = 'nodejs';

const PAGE_SIZE = 1000;

type TableExport = {
  table: string;
  select: string;
  order: string;
  header: string[];
  row: (record: Record<string, unknown>) => unknown[];
};

// Raw table exports with real column names, for spreadsheets.
const TABLE_EXPORTS: Record<string, TableExport> = {
  subscribers: {
    table: 'newsletter_subscribers',
    select: 'first_name, last_name, email, graduation_year, subscriber_type, is_active, subscribed_at',
    order: 'subscribed_at',
    header: ['First name', 'Last name', 'Email', 'Graduation year', 'Subscriber type', 'Subscribed (not unsubscribed)', 'Signed up'],
    row: (r) => [r.first_name, r.last_name, r.email, r.graduation_year, r.subscriber_type, r.is_active === false ? 'no' : 'yes', r.subscribed_at],
  },
  rsvps: {
    table: 'event_rsvps',
    select: 'full_name, email, graduation_year, guest_count, notes, created_at, events(title, event_date)',
    order: 'created_at',
    header: ['Event', 'Event date', 'Name', 'Email', 'Graduation year', 'Guests', 'Notes', 'RSVP submitted'],
    row: (r) => {
      const event = (Array.isArray(r.events) ? r.events[0] : r.events) as { title?: string; event_date?: string } | null;
      return [event?.title, event?.event_date, r.full_name, r.email, r.graduation_year, r.guest_count, r.notes, r.created_at];
    },
  },
  alumni: {
    table: 'alumni_profiles',
    select: '*, alumni_private_details(email, phone)',
    order: 'graduation_year',
    header: ['Name', 'Email', 'Phone', 'Graduation year', 'Graduation term', 'Status', 'Major', 'Company', 'Job title', 'Industry', 'Location', 'LinkedIn', 'Willing to mentor'],
    row: (r) => {
      const p = (Array.isArray(r.alumni_private_details) ? r.alumni_private_details[0] : r.alumni_private_details) as { email?: string; phone?: string } | null;
      return [
        r.full_name, p?.email, p?.phone, r.graduation_year, r.graduation_term, r.member_status, r.major, r.company, r.job_title,
        r.industry, r.location, r.linkedin_url, r.willing_to_mentor ? 'yes' : 'no',
      ];
    },
  },
  events: {
    table: 'events',
    select: '*',
    order: 'event_date',
    header: ['Title', 'Date', 'Time', 'Location', 'Status', 'Description', 'Web address'],
    row: (r) => [r.title, r.event_date, r.event_time, r.location, r.status, r.description, r.slug ? `/events/${r.slug}` : ''],
  },
  newsletters: {
    table: 'newsletters',
    select: '*',
    order: 'created_at',
    header: ['Title', 'Issue date', 'Category', 'Status', 'Subject line', 'Summary', 'Web address'],
    row: (r) => [r.title, r.issue_date, r.category, r.status, r.subject_line, r.summary, r.slug ? `/newsletter/${r.slug}` : ''],
  },
  contacts: {
    table: 'contact_submissions',
    select: 'full_name, email, inquiry_type, message, created_at',
    order: 'created_at',
    header: ['Name', 'Email', 'Topic', 'Message', 'Submitted'],
    row: (r) => [r.full_name, r.email, r.inquiry_type, r.message, r.created_at],
  },
};

function csvResponse(body: string, type: string) {
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${body}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${type}-${date}.csv"`,
    },
  });
}

export async function GET(_: Request, context: { params: Promise<{ type: string }> }) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type } = await context.params;

  const tableExport = TABLE_EXPORTS[type];
  if (tableExport) {
    const supabase = createServerSupabaseClient();
    if (!supabase) return csvResponse(toCsv(tableExport.header, []), type);

    const rows: unknown[][] = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from(tableExport.table)
        .select(tableExport.select)
        .order(tableExport.order, { ascending: false })
        .range(from, from + PAGE_SIZE - 1);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      for (const record of (data || []) as unknown as Record<string, unknown>[]) rows.push(tableExport.row(record));
      if (!data || data.length < PAGE_SIZE) break;
    }
    return csvResponse(toCsv(tableExport.header, rows), type);
  }

  return NextResponse.json({ error: 'Unsupported export type.' }, { status: 400 });
}
