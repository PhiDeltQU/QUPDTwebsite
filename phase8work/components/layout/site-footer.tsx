import Link from 'next/link';
import { ArrowUpRight, Instagram, Linkedin, Mail } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { items } from '@/lib/content/fields';
import { getPageContent } from '@/lib/content/get-content';

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function FooterLink({ label, href }: { label: string; href: string }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 transition hover:text-white">
        {label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={href || '/'} className="block transition hover:text-white">
      {label}
    </Link>
  );
}

export async function SiteFooter() {
  const c = await getPageContent('site');
  const columns = [1, 2, 3].map((n) => ({
    heading: c[`footerCol${n}Heading`],
    links: items(c, `footerCol${n}Link`, 6, ['label', 'href'] as const),
  }));
  const email = c.contactEmail.trim();
  const socials = [
    c.socialInstagram ? { href: c.socialInstagram, label: 'Instagram', Icon: Instagram } : null,
    c.socialLinkedin ? { href: c.socialLinkedin, label: 'LinkedIn', Icon: Linkedin } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <footer className="border-t border-white/10 bg-fraternity-charcoal py-14 text-white">
      <Container className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src="/brand/phi-delt-crest.webp" alt="" width={30} height={44} aria-hidden="true" className="shrink-0" />
            <h3 className="text-xl font-semibold text-white">{c.brandName}</h3>
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-argent">{c.brandChapter}</p>
          {c.footerTagline ? <p className="mt-3 max-w-sm text-sm text-white/65">{c.footerTagline}</p> : null}
          {socials.length || email ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
              {email ? (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 transition hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {email}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {columns.map((column, index) =>
          column.heading || column.links.length ? (
            <div key={index}>
              {column.heading ? <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-argent">{column.heading}</h4> : null}
              <div className="mt-4 space-y-3 text-sm text-white/70">
                {column.links.map((item) => (
                  <FooterLink key={`${item.label}-${item.href}`} label={item.label} href={item.href} />
                ))}
              </div>
            </div>
          ) : null,
        )}
      </Container>

      <Container className="mt-12 border-t border-white/10 pt-6">
        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} {c.footerCopyright}
        </p>
      </Container>
    </footer>
  );
}
