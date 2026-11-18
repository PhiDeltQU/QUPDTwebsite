# Phi Delta Theta Connecticut Epsilon website

Live at https://ctepsilonphidelts.org. Next.js (App Router) on Vercel, Supabase for data, auth and storage, Resend for email, Cloudflare Turnstile on the contact form.

**Officers do not need this file.** Everything on the public site is edited from the admin area (`/admin`, then "How to use this"). This README is for whoever maintains the code.

## How editable content works

Every public page's text, photos and buttons are defined in `lib/content/pages/<page>.ts`. Each field has a key, a label the officer sees, a type (`text`, `textarea`, `image`, `link`, `toggle`) and a default value.

* Pages read content with `getPageContent('<slug>')` from `lib/content/get-content.ts`. Saved values come from the `site_content` table (`page_slug`, `content_key`, `content_value`), and the defaults fill in anything not saved.
* Repeating cards use numbered keys (`card1Title`, `card2Title`...) built with `repeatFields()` and read back with `items()`. A slot whose first field is blank is hidden.
* The admin editor at `/admin/content/<slug>` is generated from the same definitions. Adding a field means adding it to the page definition and using it in the page. No database change is needed.
* Never rename a `slug` or field `key` after launch. Saved text is stored under those names.
* `lib/content/stale-seed-values.ts` lists the old starter text that `supabase/phase8.sql` put into production. Saved values that exactly match it are ignored.
* Photos uploaded in the editor go to the public `site-images` Supabase bucket. It is created automatically on first upload.

## Environment variables (Vercel project settings)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase. The server uses the service role key. |
| `ADMIN_LOGIN_PASSWORD` | Shared admin password. Admin emails are managed on `/admin/admins` (`admin_users` table). |
| `SESSION_SECRET` | Signs login cookies and unsubscribe links. Changing it signs everyone out. |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Email sending. The sender domain must be verified in Resend. |
| `CONTACT_NOTIFY_EMAIL` | Where contact form messages are emailed. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Contact form spam protection. |
| `FORM_IMPORT_SECRET` | Shared secret for the Google Form alumni webhook. |
| `CRON_SECRET` | Required for the daily Legacy Vault release job (`vercel.json`). The job refuses to run without it. |
| `NEXT_PUBLIC_SITE_URL` | `https://ctepsilonphidelts.org` |
| `ALUMNI_LOGIN_PASSWORD`, `ACTIVE_MEMBER_LOGIN_PASSWORD` | Legacy fallbacks, only used when Supabase Auth is not configured. |

## Database

For a fresh Supabase project, run in order: `supabase/schema.sql`, then `phase6.sql` through `phase12.sql`. Skip `seed.sql` (demo data). Then add your email to `admin_users`.

Storage buckets used: `legacy-submissions` (private), `mentorship-applications` (private), `legacy-vault` (public, admin uploads), `site-images` (public, created automatically).

## Google Form alumni import

`POST /api/integrations/alumni-import` with header `Authorization: Bearer $FORM_IMPORT_SECRET`. The body is `{ "row": {...} }` or `{ "records": [{...}] }`, with columns such as `full_name`, `email`, `phone`, `major`, `graduation_year` and `graduation_term`. Works with Google Apps Script, Zapier or Make.

## Local development

```bash
npm install
npm run dev
```

Without Supabase keys the site runs in demo mode. Data is saved to `data/demo-store.json`, which is gitignored.
