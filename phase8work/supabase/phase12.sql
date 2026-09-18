-- Security hardening pass following a full audit of the site.
-- All of these tables are only ever written/read by server-side app code
-- using the Supabase SERVICE ROLE key (see lib/supabase/admin.ts and
-- lib/supabase/server.ts, which prefers the service role key when present),
-- which bypasses RLS entirely. None of these changes affect app behavior;
-- they only close off direct access via the public anon key.

-- 1. CRITICAL: member_accounts had "for all using (true) with check (true))"
-- with no role restriction, so any holder of the public anon key could
-- read or rewrite the mapping between auth accounts and alumni profiles.
drop policy if exists "Admins can manage member links" on member_accounts;

-- 2. CRITICAL: several PII-bearing tables never had RLS enabled at all,
-- meaning they were exposed through Supabase's auto-generated REST API to
-- any anon-key holder by default. Lock them down; the app never needs
-- anon/authenticated access to any of these.
alter table if exists event_rsvps enable row level security;
alter table if exists newsletter_subscribers enable row level security;
alter table if exists mentors enable row level security;
alter table if exists mentee_requests enable row level security;
alter table if exists spotlight_posts enable row level security;
alter table if exists media_items enable row level security;
alter table if exists contact_submissions enable row level security;
alter table if exists donation_interest_submissions enable row level security;
alter table if exists admin_users enable row level security;
alter table if exists user_roles enable row level security;
alter table if exists site_content enable row level security;

-- These two tables are used throughout app/api/mentorship/opportunities and
-- app/api/alumni/mentorship but were never captured in any tracked
-- migration (schema drift), so their column definitions aren't recorded
-- here. This only locks down RLS on whatever already exists in the live
-- database; it does not (and cannot) redefine their structure. Please
-- export their real CREATE TABLE statements from the Supabase dashboard
-- and add them to a migration so this drift doesn't happen again.
alter table if exists mentorship_opportunities enable row level security;
alter table if exists mentorship_opportunity_applications enable row level security;

-- 3. MEDIUM: the alumni directory is meant to be gated behind the app's own
-- session check (see app/(marketing)/alumni/page.tsx), but this policy let
-- anyone with the anon key read every is_public alumni profile directly via
-- the REST API, bypassing that gate entirely. Drop it; the app-side queries
-- already use the service role key regardless.
drop policy if exists "Public can read public alumni profiles" on alumni_profiles;
