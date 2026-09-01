import Link from 'next/link';

export function AdminEditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-fraternity-azure/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-fraternity-azure transition hover:bg-fraternity-parchment"
    >
      Edit
    </Link>
  );
}
