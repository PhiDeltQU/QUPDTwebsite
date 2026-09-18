import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { siteConfig } from '@/lib/constants/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-fraternity-charcoal py-14 text-white">
      <Container className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/brand/phi-delt-crest.webp"
              alt=""
              width={30}
              height={44}
              aria-hidden="true"
              className="shrink-0"
            />
            <h3 className="text-xl font-semibold text-white">{siteConfig.name}</h3>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">
            {siteConfig.chapter}
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/65">
            The chapter home for brothers, future members, alumni, families, and friends at Quinnipiac University.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-argent">Discover</h4>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <Link href="/about" className="block transition hover:text-white">Our Chapter</Link>
            <Link href="/brotherhood" className="block transition hover:text-white">Brotherhood</Link>
            <Link href="/service" className="block transition hover:text-white">Service & Community</Link>
            <Link href="/recruitment" className="block transition hover:text-white">Recruitment</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-argent">Stay Connected</h4>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <Link href="/events" className="block transition hover:text-white">Events</Link>
            <Link href="/newsletter" className="block transition hover:text-white">Chapter News</Link>
            <Link href="/alumni" className="block transition hover:text-white">Alumni Network</Link>
            <Link href="/mentorship" className="block transition hover:text-white">Mentorship</Link>
            <Link href="/legacy-vault" className="block transition hover:text-white">Legacy Vault</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-argent">Take Part</h4>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <Link href="/get-involved" className="block transition hover:text-white">Get Involved</Link>
            <Link href="/contact" className="block transition hover:text-white">Contact the Chapter</Link>
            <Link href="/access" className="block transition hover:text-white">Member Sign In</Link>
            <a
              href="https://www.qu.edu/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 transition hover:text-white"
            >
              Quinnipiac University <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>

      <Container className="mt-12 border-t border-white/10 pt-6">
        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} Phi Delta Theta Connecticut Epsilon. Chapter website.
        </p>
      </Container>
    </footer>
  );
}
