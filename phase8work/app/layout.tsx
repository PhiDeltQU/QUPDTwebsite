import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/constants/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://ctepsilonphidelts.org"),
  title: {
    default: `${siteConfig.name} ${siteConfig.chapter}`,
    template: `%s | ${siteConfig.name} ${siteConfig.chapter}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} ${siteConfig.chapter}`,
    description: siteConfig.description,
    type: "website",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
