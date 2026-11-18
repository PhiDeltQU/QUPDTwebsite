'use client';

import { useEffect, useState } from 'react';
import { Linkedin, X } from 'lucide-react';

const DEFAULT_URL = 'https://www.linkedin.com/groups/34520012/';

export type LinkedInGroupPopupProps = {
  title?: string;
  text?: string;
  buttonLabel?: string;
  url?: string;
};

/** Short stable hash so pointing the popup at a new link shows it again to people who closed the old one. */
function hash(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

export function LinkedInGroupPopup({
  title = 'Join our LinkedIn alumni group',
  text = 'Connect with Connecticut Epsilon brothers and stay in the loop.',
  buttonLabel = 'Join the Group',
  url = DEFAULT_URL,
}: LinkedInGroupPopupProps) {
  const [open, setOpen] = useState(false);
  const STORAGE_KEY = `phidelt-linkedin-popup-dismissed-${hash(url)}`;

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage unavailable (private mode, etc.), so show the popup anyway
    }

    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [STORAGE_KEY]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] w-[min(20rem,calc(100vw-2.5rem))] animate-slide-in"
      role="complementary"
      aria-label={title}
    >
      <div className="surface relative p-5">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-fraternity-charcoal/60 transition hover:bg-fraternity-parchment hover:text-fraternity-charcoal"
          onClick={dismiss}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fraternity-azure/10 text-fraternity-azure">
          <Linkedin className="h-4.5 w-4.5" aria-hidden="true" />
        </span>

        <p className="mt-3 pr-4 text-sm font-semibold text-fraternity-charcoal">{title}</p>
        {text ? <p className="mt-1 pr-4 text-xs text-fraternity-slate">{text}</p> : null}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-fraternity-azure px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-fraternity-azureDeep"
        >
          {buttonLabel}
        </a>
      </div>
    </div>
  );
}
