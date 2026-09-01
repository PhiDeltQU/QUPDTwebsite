import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { PathwayCard } from '@/components/cards/pathway-card';

export const metadata: Metadata = {
  title: 'Member Sign In',
  description: 'Choose the correct Phi Delta Theta Connecticut Epsilon member or officer portal.',
};

const accessPaths = [
  {
    eyebrow: 'Current Chapter',
    title: 'Active Member Sign In',
    description: 'Access active-member resources, applications, opportunities, and chapter tools.',
    href: '/active/login',
    linkLabel: 'Continue as an active member',
  },
  {
    eyebrow: 'After Graduation',
    title: 'Alumni Sign In',
    description: 'Access the alumni portal, profile tools, directory, mentorship, and chapter network.',
    href: '/member/login',
    linkLabel: 'Continue as an alumnus',
  },
  {
    eyebrow: 'Chapter Leadership',
    title: 'Officer & Admin Sign In',
    description: 'Manage chapter content, records, newsletters, events, submissions, and operational workflows.',
    href: '/admin/login',
    linkLabel: 'Continue as an administrator',
  },
] as const;

export default function AccessPage() {
  return (
    <>
      <PageHero
        eyebrow="Member Access"
        title="Choose the space that belongs to you"
        description="Connecticut Epsilon uses separate access paths for active members, alumni, and chapter administrators."
      />
      <SectionShell
        title="Select your portal"
        description="If you have not claimed your account yet, use the setup option available from the appropriate sign-in page."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {accessPaths.map((path) => (
            <PathwayCard key={path.title} {...path} />
          ))}
        </div>
      </SectionShell>
    </>
  );
}
