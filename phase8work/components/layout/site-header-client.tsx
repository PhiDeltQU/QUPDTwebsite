'use client';

import Link from 'next/link';
import { LockKeyhole, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { SessionRole } from '@/types';

function getPortalLink(role: SessionRole | null) {
  if (role === 'active') {
    return { href: '/active', label: 'Member Portal' };
  }

  if (role === 'alumni') {
    return { href: '/member', label: 'Alumni Portal' };
  }

  if (role === 'admin') {
    return { href: '/admin', label: 'Admin Portal' };
  }

  return { href: '/access', label: 'Member Sign In' };
}

export type HeaderSettings = {
  brandName: string;
  brandChapter: string;
  logoAlt: string;
  nav: { label: string; href: string }[];
  button: { label: string; href: string } | null;
};

export function SiteHeaderClient({ role, settings }: { role: SessionRole | null; settings: HeaderSettings }) {
  const { nav: navItems, button } = settings;
  const [open, setOpen] = useState(false);
  const portalLink = getPortalLink(role);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-fraternity-cream/95 backdrop-blur-md">
      <Container className="flex h-[5.25rem] items-center justify-between gap-5">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={settings.logoAlt}
        >
          <img
            src="/brand/phi-delt-crest.webp"
            alt=""
            width={30}
            height={44}
            aria-hidden="true"
            className="shrink-0 transition-transform group-hover:-translate-y-0.5"
          />
          <span className="flex flex-col">
            <span className="font-serif text-lg font-semibold leading-tight text-fraternity-charcoal">
              {settings.brandName}
            </span>
            <span className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-fraternity-azure">
              {settings.brandChapter}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className="text-sm font-semibold text-fraternity-charcoal/80 transition hover:text-fraternity-azure"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            href={portalLink.href}
            className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-fraternity-charcoal transition hover:bg-white hover:text-fraternity-azure"
          >
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            {portalLink.label}
          </Link>
          {button ? <Button href={button.href}>{button.label}</Button> : null}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav-menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-fraternity-charcoal xl:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <div
        id="mobile-nav-menu"
        className={cn(
          'border-t border-black/5 bg-fraternity-cream xl:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <Container className="grid gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-fraternity-charcoal transition hover:bg-white hover:text-fraternity-azure"
            >
              {item.label}
            </Link>
          ))}
          <div className="grid gap-2 border-t border-black/5 pt-4 sm:grid-cols-2">
            <Button href={portalLink.href} variant="secondary" className="w-full">
              {portalLink.label}
            </Button>
            {button ? (
              <Button href={button.href} className="w-full">
                {button.label}
              </Button>
            ) : null}
          </div>
        </Container>
      </div>
    </header>
  );
}
