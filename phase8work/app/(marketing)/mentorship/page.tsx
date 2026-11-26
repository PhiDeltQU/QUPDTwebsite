import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { ProfileCard } from "@/components/cards/profile-card";
import { MentorSignupForm } from "@/components/forms/mentor-signup-form";
import { MenteeRequestForm } from "@/components/forms/mentee-request-form";
import { getPublicMentorshipOpportunities } from "@/lib/queries/mentorship-opportunities";
import { getAlumniProfiles } from "@/lib/queries/public";
import { getPageContent } from "@/lib/content/get-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentorship",
  description: "Connect alumni and active members through the chapter's mentorship program at Phi Delta Theta Connecticut Epsilon.",
};

export const dynamic = "force-dynamic";

function formatOpportunityType(value?: string | null) {
  if (!value) return "Opportunity";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function MentorshipPage() {
  const [profiles, opportunities, c] = await Promise.all([
    getAlumniProfiles(),
    getPublicMentorshipOpportunities(),
    getPageContent("mentorship"),
  ]);
  const mentors = profiles.filter((profile) => profile.mentor);

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        description={c.heroDescription}
      />

      <SectionShell
        eyebrow={c.opportunitiesEyebrow}
        title={c.opportunitiesTitle}
        description={c.opportunitiesDescription}
      >
        {opportunities.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="surface flex h-full flex-col p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-fraternity-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-azure">
                    {formatOpportunityType(opportunity.opportunity_type)}
                  </span>
                  {opportunity.location_type ? (
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-fraternity-slate">
                      {formatOpportunityType(opportunity.location_type)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-2xl">{opportunity.title}</h3>

                <div className="mt-3 space-y-1 text-sm text-fraternity-slate">
                  <p>
                    {opportunity.company || "Phi Delta Theta Alumni Opportunity"}
                    {opportunity.location ? ` · ${opportunity.location}` : ""}
                  </p>
                  <p>
                    Industry: {opportunity.industry || "Not specified"}
                    {opportunity.preferred_major
                      ? ` · Preferred major: ${opportunity.preferred_major}`
                      : ""}
                  </p>
                  {opportunity.preferred_years ? (
                    <p>Preferred class years: {opportunity.preferred_years}</p>
                  ) : null}
                </div>

                <p className="mt-4 text-fraternity-slate">
                  {opportunity.description}
                </p>

                {opportunity.requirements ? (
                  <p className="mt-4 text-sm text-fraternity-slate">
                    <span className="font-semibold text-fraternity-charcoal">
                      Requirements:
                    </span>{" "}
                    {opportunity.requirements}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/mentorship/${opportunity.slug || opportunity.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-fraternity-azure px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    {c.opportunityDetailsLabel}
                  </Link>
                  <Link
                    href={`/mentorship/${opportunity.slug || opportunity.id}/apply`}
                    className="inline-flex items-center justify-center rounded-full border border-fraternity-charcoal/15 bg-white px-5 py-3 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
                  >
                    {c.opportunityApplyLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">{c.opportunitiesEmptyMessage}</p>
          </div>
        )}
      </SectionShell>

      <SectionShell
        title={c.mentorsTitle}
        description={c.mentorsDescription}
      >
        {mentors.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map((profile) => (
              <ProfileCard key={profile.name} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">{c.mentorsEmptyMessage}</p>
          </div>
        )}
      </SectionShell>

      <SectionShell
        eyebrow="Get Involved"
        title="Volunteer or Request a Mentor"
        description="Alumni can offer their time as a mentor, and members can request to be matched with one."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <MentorSignupForm />
          <MenteeRequestForm />
        </div>
      </SectionShell>
    </>
  );
}