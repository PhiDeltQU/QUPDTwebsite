import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSessionUser } from "@/lib/auth/session";
import type { SessionRole } from "@/types";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionUser();
  const role: SessionRole | null = session?.role ?? null;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-fraternity-azure focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <SiteHeader role={role} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}