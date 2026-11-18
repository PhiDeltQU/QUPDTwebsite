import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const adminLinkGroups = [
  {
    heading: 'Start here',
    links: [
      { href: '/admin/help', label: 'How to use this' },
      { href: '/admin', label: 'Overview' },
    ],
  },
  {
    heading: 'Website',
    links: [
      { href: '/admin/content', label: 'Edit pages' },
      { href: '/admin/events', label: 'Events' },
      { href: '/admin/newsletters', label: 'Newsletters' },
      { href: '/admin/media', label: 'Legacy Vault items' },
    ],
  },
  {
    heading: 'People',
    links: [
      { href: '/admin/alumni', label: 'Alumni and members' },
      { href: '/admin/import', label: 'Import from spreadsheet' },
      { href: '/admin/mentorship', label: 'Mentorship' },
    ],
  },
  {
    heading: 'Inbox',
    links: [
      { href: '/admin/submissions', label: 'Messages' },
      { href: '/admin/legacy-review', label: 'Legacy Vault submissions' },
      { href: '/admin/review', label: 'Counts at a glance' },
    ],
  },
  {
    heading: 'Settings',
    links: [{ href: '/admin/admins', label: 'Admins' }],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession("admin");
  if (!session) redirect("/admin/login");

  return (
    <>
      <SiteHeader role="admin" />

      <main className="min-h-screen bg-fraternity-cream">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
          <aside className="surface w-full shrink-0 p-6 md:sticky md:top-6 md:w-72 md:self-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">
                Admin portal
              </p>
              <p className="mt-3 text-4xl font-serif tracking-tight text-fraternity-charcoal">Admin Workspace</p>
              <p className="mt-4 text-fraternity-slate">
                Signed in as {session.email}. New here? Start with "How to use this."
              </p>
            </div>

            <nav aria-label="Admin sections" className="mt-8 space-y-5">
              {adminLinkGroups.map((group) => (
                <div key={group.heading}>
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-slate">{group.heading}</p>
                  <div className="mt-1 flex flex-col gap-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-xl px-3 py-2 text-base font-medium text-fraternity-charcoal transition hover:bg-black/5"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-8">
              <LogoutButton redirectTo="/" />
            </div>
          </aside>

          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}