import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession("alumni");
  if (!session) redirect("/member/login");

  return (
    <>
      <SiteHeader role="alumni" />

      <main className="min-h-screen bg-fraternity-cream">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="surface mb-8 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-azure">
                Alumni portal
              </p>
              <p className="mt-3 text-3xl font-serif tracking-tight text-fraternity-charcoal">Private alumni access</p>
              <p className="mt-2 text-sm text-fraternity-slate">
                Signed in as {session.email}. This portal supports linked alumni
                accounts, self-service profile editing, mentorship opportunity
                posting, and applicant review.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/member"
                className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal"
              >
                Overview
              </Link>

              <Link
                href="/member/profile"
                className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal"
              >
                My Profile
              </Link>

              <Link
                href="/member/directory"
                className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal"
              >
                Private Directory
              </Link>

              <Link
                href="/member/mentorship"
                className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal"
              >
                Mentorship
              </Link>

              <LogoutButton redirectTo="/" />
            </div>
          </div>

          {children}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}