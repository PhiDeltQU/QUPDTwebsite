import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';
import { ValueCard } from '@/components/cards/value-card';
import { TimelineItem } from '@/components/cards/timeline-item';
import { timeline, values } from '@/lib/constants/site';
import { getAboutPageContent } from '@/lib/queries/content';

export const metadata: Metadata = {
  title: 'Our Chapter',
  description: 'Learn about Phi Delta Theta Connecticut Epsilon, its values, foundation, and growing chapter story at Quinnipiac University.',
};

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        image="/images/chapter/chapter-showcase.jpg"
        imageAlt="Phi Delta Theta Connecticut Epsilon brothers gathered at a campus showcase"
        imagePosition="center 55%"
        actions={
          <>
            <Button href="/recruitment">Explore Recruitment</Button>
            <Button href="/contact" variant="secondary">Contact the Chapter</Button>
          </>
        }
      />

      <SectionShell title={content.overviewTitle} description={content.overviewDescription}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface p-8 md:p-10">
            <p className="text-lg">{content.overviewBody}</p>
            <p className="mt-5">{content.overviewBodySecondary}</p>
          </div>
          <div className="rounded-3xl bg-fraternity-charcoal p-8 text-white md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fraternity-gold">At a Glance</p>
            <dl className="mt-6 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              <div>
                <dt className="text-sm text-white/55">Campus</dt>
                <dd className="mt-1 font-serif text-2xl">Quinnipiac University</dd>
              </div>
              <div className="border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-5 lg:border-l-0 lg:border-t lg:pl-0">
                <dt className="text-sm text-white/55">Chapter</dt>
                <dd className="mt-1 font-serif text-2xl">Connecticut Epsilon</dd>
              </div>
              <div className="border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-5 lg:border-l-0 lg:border-t lg:pl-0">
                <dt className="text-sm text-white/55">Established</dt>
                <dd className="mt-1 font-serif text-2xl">2025</dd>
              </div>
            </dl>
          </div>
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Our Cardinal Principles</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Three values, practiced every day</h2>
            <p className="mt-4 max-w-2xl text-lg">These principles give the chapter a common standard for relationships, learning, leadership, and service.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => <ValueCard key={value.title} {...value} />)}
          </div>
        </div>
      </section>

      <SectionShell eyebrow="Chapter Character" title={content.themesTitle} description="The chapter experience is shaped by what brothers choose to practice together.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            [content.themeOneTitle, content.themeOneDescription],
            [content.themeTwoTitle, content.themeTwoDescription],
            [content.themeThreeTitle, content.themeThreeDescription],
          ].map(([title, description], index) => (
            <article key={title} className="surface p-8">
              <p className="eyebrow">0{index + 1}</p>
              <h3 className="mt-4 text-2xl">{title}</h3>
              <p className="mt-4">{description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="section-padding bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">{content.timelineEyebrow}</p>
            <h2 className="mt-3 text-3xl md:text-4xl">{content.timelineTitle}</h2>
            <p className="mt-4 max-w-2xl text-lg">{content.timelineDescription}</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {timeline.map((item) => (
              <TimelineItem key={item.year + item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        eyebrow="Keep Exploring"
        title="See what the chapter looks like in action"
        description="Explore the brotherhood experience, learn how Connecticut Epsilon serves, or start a conversation about membership."
        actions={
          <>
            <Button href="/brotherhood" variant="secondary">Brotherhood</Button>
            <Button href="/service">Service</Button>
          </>
        }
      />
    </>
  );
}
