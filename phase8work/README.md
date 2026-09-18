# Phi Delta Theta Site - Phase 7

Phase 7 focuses on the member account system.

## New in this phase
- Supabase-backed alumni email/password sign-in for member access
- claim-your-profile flow that links an auth account to an alumni record
- self-service member profile editing
- privacy settings for public vs member-only visibility

## Required environment for full Phase 7 behavior
Create `.env.local` in the app root:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_LOGIN_PASSWORD=
SESSION_SECRET=
```

`ALUMNI_LOGIN_PASSWORD` is now only a legacy fallback if Supabase Auth is not configured.

## Supabase setup
1. Run `supabase/schema.sql` if starting fresh.
2. If you already have an existing Phase 6 database, run `supabase/phase7.sql`, then the later `phaseN.sql` files in order (8, 9, 10, 11, 12).
3. Run `supabase/seed.sql` if you want the demo alumni/event/newsletter data.
4. Make sure `admin@example.org` exists in `admin_users` or replace it with your own email.
5. Use the contact email in `alumni_private_details` when claiming a member profile.
6. **Required after a security audit:** run `supabase/phase12.sql` against any existing database — it locks down a permissive `member_accounts` policy and enables RLS on several tables that previously had none (see the comments in that file for why). It's a no-op for fresh installs since `schema.sql` already reflects the fixed state.

## Phase 7 member flow
1. Officers seed or import alumni profiles.
2. Alumni private details include the alumnus email.
3. Alumni goes to `/member/claim` and enters their name, graduation year, and email on file. If it matches, a one-time secure link is emailed to that address (no password is collected on this page — this prevents someone who just knows an alumnus's name/year/email from creating an account as them).
4. The alumnus opens the emailed link at `/member/claim/complete` and sets a password there. The link expires after 30 minutes or on first use.
5. The alumnus signs in at `/member/login`.
6. The alumnus manages the profile at `/member/profile`.

## Notes
- Admin login still uses the local env password for now.
- Member login uses Supabase Auth when your project keys are present.
- Member route protection still uses the app's signed cookie session after successful authentication.

## Google Form / spreadsheet automation
If you want new form responses to go directly into Supabase without a manual CSV upload, use the webhook at:

`POST /api/integrations/alumni-import`

Authenticate with either:

- `Authorization: Bearer $FORM_IMPORT_SECRET`
- or `x-import-secret: $FORM_IMPORT_SECRET`

The route accepts either a single row object, `{ row: {...} }`, or `{ records: [{...}] }`.

Example payload:

```json
{
  "row": {
    "full_name": "Samuel Joor",
    "email": "samuel.joor@quinnipiac.edu",
    "phone": "9789124177",
    "major": "Data Science",
    "graduation_year": "2026",
    "graduation_term": "Spring"
  }
}
```

This is designed to work well with Google Apps Script, Zapier, Make, or Power Automate after a Google Form / spreadsheet submission.
