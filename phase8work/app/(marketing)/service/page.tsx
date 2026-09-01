import Image from 'next/image';
import type { Metadata } from 'next';
import { HandHeart, HeartPulse, Users } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export const metadata: Metadata = {
  title: 'Service',
  description: 'How Phi Delta Theta Connecticut Epsilon puts rectitude into action through national and local service.',
};

const servicePillars = [
  {
    eyebrow: 'National Partnership',
    title: 'Live Like Lou',
    description:
      'Phi Delta Theta partners nationally with the ALS Association in honor of Lou Gehrig, a Phi Delt brother, supporting research and families affected by ALS.',
    href: 'https://www.phideltatheta.org/',
    linkLabel: 'Learn about Live Like Lou',
  },
  {
    eyebrow: 'On Campus',
    title: 'Serving the Quinnipiac community',
    description: 'Chapter service projects with campus partners and student organizations — details on current initiatives coming soon.',
    href: '/contact',
    linkLabel: 'Ask about current projects',
  },
  {
    eyebrow: 'Get Involved',
    title: 'Partner with the chapter',
    description: 'Local organizations and alumni looking to propose a service opportunity can reach the chapter directly.',
    href: '/contact',
    linkLabel: 'Propose an opportunity',
  },
] as const;

export default function ServicePage() {
  return (
    <>
      <PageHero
        eyebrow="Service"
        title="Living rectitude through action"
        description="Service is one of the ways Connecticut Epsilon puts its cardinal principles into practice — both through Phi Delta Theta's national philanthropy and local community work."
        image="/images/chapter/community-service.jpg"
        imageAlt="Phi Delta Theta Connecticut Epsilon brothers volunteering in the community"
        imagePosition="center 40%"
        actions={
          <>
            <Button href="/contact">Partner With Us</Button>
            <Button href="/brotherhood" variant="secondary">See Chapter Life</Button>
          </>
        }
      />

      <SectionShell
        eyebrow="How We Serve"
        title="National philanthropy, local commitment"
        description="Service happens at two levels: the cause Phi Delta Theta stands behind nationally, and the work Connecticut Epsilon does closer to home."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {servicePillars.map((pillar) => (
            <PathwayCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="image-frame min-h-[24rem] lg:min-h-[28rem]">
              <Image
                src="/images/chapter/brotherhood-on-the-quad.jpg"
                alt="Phi Delta Theta brothers on the Quinnipiac quad"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">Why It Matters</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">Rectitude means more than a word in our creed</h2>
              <p className="mt-5 text-lg">
                Phi Delta Theta&apos;s third cardinal principle, Rectitude, asks brothers to act with integrity and leave
                every community they touch better than they found it.
              </p>
              <p className="mt-4">
                As a young chapter, Connecticut Epsilon is still building out its local service program. This page will
                grow to include real volunteer hours, campus partnerships, and community initiatives as they take shape.
              </p>
              <Button href="/contact" variant="secondary" className="mt-7">
                Suggest a Service Partnership
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow="Service in Action"
        title="What service looks like at Connecticut Epsilon"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <article className="surface p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fraternity-azure/10 text-fraternity-azure">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-2xl">ALS Awareness</h3>
            <p className="mt-4 text-sm">Supporting Phi Delta Theta's national Live Like Lou campaign through fundraising and awareness events.</p>
          </article>
          <article className="surface p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fraternity-azure/10 text-fraternity-azure">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-2xl">Campus Partnerships</h3>
            <p className="mt-4 text-sm">Working alongside Quinnipiac student organizations on shared service and community-building efforts.</p>
          </article>
          <article className="surface p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-fraternity-azure/10 text-fraternity-azure">
              <HandHeart className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-2xl">Local Volunteering</h3>
            <p className="mt-4 text-sm">Building an ongoing volunteer program in North Haven and the greater Quinnipiac community.</p>
          </article>
        </div>
      </SectionShell>

      <CTASection
        eyebrow="Work With Us"
        title="Know a cause Connecticut Epsilon should support?"
        description="Alumni, campus partners, and local organizations are welcome to reach out about service opportunities and partnerships."
        actions={<Button href="/contact" variant="secondary">Contact the Chapter</Button>}
      />
    </>
  );
}
