import Image from 'next/image';
import type { Metadata } from 'next';
import { BookOpen, BriefcaseBusiness, HeartHandshake, Users } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Brotherhood',
  description: 'Explore active chapter life, leadership, service, and lifelong brotherhood at Phi Delta Theta Connecticut Epsilon.',
};

const brotherhoodPathways = [
  {
    eyebrow: 'Shared Experience',
    title: 'Belong to something real',
    description: 'Build friendships through the everyday moments, traditions, and responsibilities that turn members into brothers.',
    href: '/events',
    linkLabel: 'See chapter events',
  },
  {
    eyebrow: 'Responsibility',
    title: 'Learn by leading',
    description: 'Own meaningful work, lead peers, solve problems, and build habits that carry into campus, career, and community life.',
    href: '/recruitment',
    linkLabel: 'Explore membership',
  },
  {
    eyebrow: 'For Life',
    title: 'Keep the connection going',
    description: 'Stay part of a network built through mentorship, career opportunities, chapter traditions, and lifelong friendship.',
    href: '/alumni',
    linkLabel: 'Open the alumni network',
  },
] as const;

const experienceAreas = [
  {
    icon: BookOpen,
    title: 'Sound Learning',
    description: 'Encourage strong academic habits, curiosity, and the confidence to keep learning from one another.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Leadership',
    description: 'Build practical experience through chapter roles, event planning, communication, and shared accountability.',
  },
  {
    icon: HeartHandshake,
    title: 'Service',
    description: 'Put rectitude into practice by showing up for campus partners and the wider community.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Create friendships and traditions that make college richer and remain meaningful after graduation.',
  },
] as const;

export default function BrotherhoodPage() {
  return (
    <>
      <PageHero
        eyebrow="Brotherhood"
        title="A chapter experience built through shared effort"
        description="Connecticut Epsilon is where friendship, accountability, leadership, service, and ambition become part of the same experience."
        image="/images/chapter/brotherhood-event.jpg"
        imageAlt="Phi Delta Theta brothers gathered at a chapter brotherhood event"
        imagePosition="center 45%"
        actions={
          <>
            <Button href="/recruitment">Explore Recruitment</Button>
            <Button href="/access" variant="secondary">Member Sign In</Button>
          </>
        }
      />

      <SectionShell
        eyebrow="The Experience"
        title="Brotherhood is something members build together"
        description="The strongest chapter experience comes from showing up for one another, taking responsibility, and creating traditions worth carrying forward."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {brotherhoodPathways.map((pathway) => (
            <PathwayCard key={pathway.title} {...pathway} />
          ))}
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="image-frame min-h-[28rem]">
              <Image
                src="/images/chapter/campus-community.jpg"
                alt="Phi Delta Theta brothers participating with the wider Quinnipiac campus community"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">More Than Meetings</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">A fuller way to experience college</h2>
              <p className="mt-5 text-lg">Chapter life creates reasons to connect across campus—through friendship, competition, collaboration, service, and the work of building something together.</p>
              <p className="mt-4">The goal is not to make every brother the same. It is to give different people a shared standard, a dependable community, and room to become more capable versions of themselves.</p>
              <Button href="/events" variant="secondary" className="mt-7">See What&apos;s Happening</Button>
            </div>
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow="How Members Grow"
        title="A chapter experience with more than one dimension"
        description="Brotherhood should support the whole person—on campus, in the classroom, in leadership, and in life after Quinnipiac."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {experienceAreas.map(({ icon: Icon, title, description }) => (
            <article key={title} className="surface p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fraternity-azure/10 text-fraternity-azure">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-2xl">{title}</h3>
              <p className="mt-4 text-sm">{description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <CTASection
        eyebrow="Start Here"
        title="See whether Connecticut Epsilon is the right fit"
        description="Meet the brothers, ask honest questions, and learn what membership could add to your Quinnipiac experience."
        actions={
          <>
            <Button href="/recruitment" variant="secondary">Recruitment</Button>
            <Button href="/contact">Contact the Chapter</Button>
          </>
        }
      />
    </>
  );
}
