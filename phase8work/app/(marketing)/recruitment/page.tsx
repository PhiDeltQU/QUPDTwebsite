import Image from 'next/image';
import type { Metadata } from 'next';
import { CalendarCheck, HandHeart, MessagesSquare, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { PathwayCard } from '@/components/cards/pathway-card';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { values } from '@/lib/constants/site';

export const metadata: Metadata = {
  title: 'Recruitment',
  description: 'Learn how to join Phi Delta Theta Connecticut Epsilon at Quinnipiac University.',
};

const recruitmentSteps = [
  {
    icon: MessagesSquare,
    title: 'Meet the Brothers',
    description: 'Come to an open event, ask real questions, and get a feel for the chapter beyond a single conversation.',
  },
  {
    icon: CalendarCheck,
    title: 'Attend Recruitment Events',
    description: 'Follow the chapter and campus fraternity & sorority life office for the current semester’s recruitment schedule.',
  },
  {
    icon: ShieldCheck,
    title: 'Receive a Bid',
    description: 'Chapter members vote to extend bids to prospective members who reflect our values and add to the chapter.',
  },
  {
    icon: HandHeart,
    title: 'New Member Education',
    description: 'Learn chapter history, ritual, and expectations before being initiated as a full brother.',
  },
] as const;

const whatWeLookFor = [
  {
    eyebrow: 'Character',
    title: 'People who show up for others',
    description: 'We look for guys who are dependable, honest, and genuinely invested in the people around them.',
    href: '/brotherhood',
    linkLabel: 'See what brotherhood looks like',
  },
  {
    eyebrow: 'Ambition',
    title: 'A drive to grow',
    description: 'Membership is a place to build real leadership experience, not just a social label.',
    href: '/about',
    linkLabel: 'Learn about the chapter',
  },
  {
    eyebrow: 'Commitment',
    title: 'Willingness to contribute',
    description: 'Chapters are built by members who show up, take on responsibility, and support one another and the community.',
    href: '/service',
    linkLabel: 'See our service commitment',
  },
] as const;

export default function RecruitmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Recruitment"
        title="Find out if Connecticut Epsilon is right for you"
        description="Phi Delta Theta at Quinnipiac University is looking for future members who want real friendship, leadership experience, and a chapter built on integrity."
        image="/images/chapter/formal-chapter.jpg"
        imageAlt="Phi Delta Theta Connecticut Epsilon brothers together on campus"
        imagePosition="center 35%"
        actions={
          <>
            <Button href="/contact">Ask a Question</Button>
            <Button href="/brotherhood" variant="secondary">See Chapter Life</Button>
          </>
        }
      />

      <section className="section-padding pb-0">
        <Container>
          <div className="surface flex flex-col items-center gap-4 p-8 text-center md:p-10">
            <Image
              src="/brand/phi-delt-crest-tagline.jpg"
              alt="Phi Delta Theta — Become the Greatest Version of Yourself"
              width={196}
              height={183}
              className="h-24 w-auto rounded-2xl"
            />
            <p className="max-w-xl text-sm text-fraternity-slate">
              That&apos;s not just a slogan on a graphic — it&apos;s what recruitment at Connecticut Epsilon is actually about.
            </p>
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow="What We Look For"
        title="Membership built on real standards, not a stereotype"
        description="Connecticut Epsilon is guided by Phi Delta Theta's three cardinal principles: Friendship, Sound Learning, and Rectitude."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {whatWeLookFor.map((item) => (
            <PathwayCard key={item.title} {...item} />
          ))}
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="image-frame min-h-[24rem] lg:min-h-[28rem]">
              <Image
                src="/images/chapter/meet-the-brothers.jpg"
                alt="Prospective members meeting Phi Delta Theta brothers"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">Our Values</p>
              <h2 className="mt-4 text-3xl leading-tight md:text-4xl">The principles behind every bid we extend</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-1">
                {values.map((value) => (
                  <div key={value.title}>
                    <h3 className="text-lg font-semibold text-fraternity-charcoal">{value.title}</h3>
                    <p className="mt-1 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SectionShell
        eyebrow="The Process"
        title="How recruitment works"
        description="Every chapter runs recruitment a little differently. Here is what to expect at Connecticut Epsilon."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recruitmentSteps.map(({ icon: Icon, title, description }) => (
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
        eyebrow="Take the First Step"
        title="Have questions about joining Connecticut Epsilon?"
        description="Reach out directly and a chapter officer will get back to you with recruitment details and the current semester's event schedule."
        actions={
          <>
            <Button href="/contact" variant="secondary">Contact the Chapter</Button>
            <Button href="/events">View Events</Button>
          </>
        }
      />
    </>
  );
}
