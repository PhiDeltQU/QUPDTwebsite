# Chapter Admin Guide

This is the "how do I actually run the site" guide for whoever holds the chairman/admin role. The main `README.md` covers the tech stack for a developer; this one is for day-to-day operation.

All admin pages live at `/admin` on the production site and require the shared admin password (`ADMIN_LOGIN_PASSWORD`, stored in the shared vault — see the handoff runbook).

## Logging in

Go to `/admin/login` and enter the admin password. There's a single shared password for the whole admin role — there are no individual admin accounts, so if it's ever rotated (e.g. during a chairman handoff), everyone with the admin role needs the new value from the vault.

## Dashboard (`/admin`)

Landing page showing quick stats — alumni count, available mentors, published events, newsletter issues, pending legacy submissions, unread contact-form messages. Also flags whether the site is reading real data or sample/placeholder data (`dataSource`), which matters right after a fresh Supabase setup.

## Importing members (`/admin/import`)

This is how the alumni/member directory gets populated or updated — there's no manual "add one person" form for bulk use, it's CSV-only.

1. Export or prepare a CSV with these columns: `full_name, email, phone, bond_number, major, graduation_year, graduation_term, alumni_access_enabled, company, job_title, industry, location, linkedin_url, short_bio, willing_to_mentor, is_public, is_featured`.
2. Paste the CSV text or upload the file on `/admin/import`.
3. The importer derives **active member vs. alumni** status automatically from `graduation_year` + `graduation_term` — you don't need to set status by hand, and `member_status` is ignored if present.
4. Submitting re-runs the import, so uploading the same roster again with updated rows is the normal way to keep the directory current (it's an upsert, not append-only).

There's also a Google Form import path wired to the same endpoint — if the chapter uses a Google Form for self-reported alumni updates, check with the outgoing chairman whether that's still connected before assuming CSV is the only path in.

## Managing alumni records (`/admin/alumni`)

Table view of every imported record with edit/delete per row, and a CSV export (`/api/admin/export/alumni`) if you need to pull the current roster back out.

## Newsletters (`/admin/newsletters`)

1. "Create newsletter issue" drafts a new issue — title, slug, category, issue date, subject line, summary (10–160 chars), full body (up to 10,000 chars), and a status (draft/published/sent).
2. The **send button** next to each issue only actually emails subscribers once `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are set in the environment — until then it runs in preview/local-only mode and just marks the record, it does not send mail. If sending doesn't seem to work, check those two env vars first.
3. Sending marks the issue as "sent" so you don't double-send by accident.

## Legacy Vault review (`/admin/legacy-review`)

Chapter history/memory submissions queue here before going public.

- Each pending submission shows the writer, their class year, the memory text, and an attachment preview (image or PDF) if one was uploaded.
- **Approve** or **Decline** per submission. Approved items don't go live immediately — they stay queued until the submitter's chosen release date, then the system emails it back to them automatically (this depends on Resend being configured, same as newsletters).

## Mentorship (`/admin/mentorship`)

Matches alumni who marked themselves `willing_to_mentor` during import against mentorship/opportunity requests from current members.

## Content, media, events, submissions

- `/admin/content` — edit the homepage and About page copy without touching code.
- `/admin/media` — manage uploaded media assets.
- `/admin/events` — create/edit chapter events shown on the public events calendar.
- `/admin/submissions` — general contact-form inquiries (protected by Cloudflare Turnstile on the public form).

## Who to ask

If something breaks and this guide doesn't cover it, check the main `README.md` for the architecture, or reach the outgoing chairman at: **[fill in contact + how long they're reachable for]**.
