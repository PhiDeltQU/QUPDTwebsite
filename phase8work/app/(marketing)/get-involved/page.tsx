import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Find ways to attend, mentor, share, reconnect, and support Phi Delta Theta Connecticut Epsilon.',
};

const involvementOptions = [
  {
    eyebrow: 'Attend',
    title: 'Join a chapter event',
    description: 'Find upcoming gatherings for active brothers, alumni, families, and friends of Connecticut Epsilon.',
    href: '/events',
    linkLabel: 'View events',
  },
  {
    eyebrow: 'Mentor',
    title: 'Share experience and opportunity',
    description: 'Support active brothers through career conversations, mentorship, introductions, internships, and practical advice.',
    href: '/mentorship',
    linkLabel: 'Explore mentorship',
  },
  {
    eyebrow: 'Stay Informed',
    title: 'Follow chapter news',
    description: 'Read the latest chapter updates and join the newsletter list for future communications.',
    href: '/newsletter',
    linkLabel: 'Read chapter news',
  },
  {
    eyebrow: 'Preserve',
    title: 'Contribute to the Legacy Vault',
    description: 'Help document chapter milestones, photos, letters, memories, and traditions for the brothers who follow.',
    href: '/legacy-vault',
    linkLabel: 'Open the Legacy Vault',
  },
  {
    eyebrow: 'Reconnect',
    title: 'Return to the alumni network',
    description: 'Access the existing directory and member tools built to keep brothers connected beyond graduation.',
    href: '/alumni',
    linkLabel: 'Open the alumni network',
  },
  {
    eyebrow: 'Reach Out',
    title: 'Start a conversation',
    description: 'Offer an idea, ask a question, propose a partnership, or tell the chapter how you would like to help.',
    href: '/contact',
    linkLabel: 'Contact the chapter',
  },
] as const;

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="There is more than one way to strengthen the chapter"
        description="Give time, share experience, attend an event, preserve a memory, or simply stay connected to what Connecticut Epsilon is building."
        actions={
          <>
            <Button href="/events">View Events</Button>
            <Button href="/contact" variant="secondary">Contact the Chapter</Button>
          </>
        }
      />

      <SectionShell
        eyebrow="Choose a Path"
        title="Start with the kind of involvement that fits"
        description="A strong chapter community makes room for active brothers, alumni, families, friends, mentors, and campus partners."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {involvementOptions.map((option) => (
            <PathwayCard key={option.title} {...option} />
          ))}
        </div>
      </SectionShell>

      <CTASection
        eyebrow="Not Sure Where to Start?"
        title="Tell us how you would like to connect"
        description="The chapter can help route your interest to recruitment, alumni engagement, events, mentorship, communications, or another officer."
        actions={<Button href="/contact" variant="secondary">Send a Message</Button>}
      />
    </>
  );
}
