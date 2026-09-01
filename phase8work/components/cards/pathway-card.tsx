import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type PathwayCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export function PathwayCard({ eyebrow, title, description, href, linkLabel }: PathwayCardProps) {
  return (
    <Link
      href={href}
      className="surface group flex h-full flex-col p-7 transition duration-200 hover:-translate-y-1 hover:border-fraternity-azure/20 hover:shadow-lg"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-azure">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl">{title}</h3>
      <p className="mt-4 flex-1 text-sm">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fraternity-azure">
        {linkLabel}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
