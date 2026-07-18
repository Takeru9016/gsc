import { Check } from "lucide-react";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import type { PartnershipOpportunity } from "@/lib/sanity/queries.ts";
import { cn, getPortableTextSnippet } from "@/lib/utils.ts";

// [PENDING_CONTENT] — shown until partnershipOpportunity documents exist in Sanity.
const PLACEHOLDER_OPPORTUNITIES: PartnershipOpportunity[] = [
  {
    _id: "placeholder-title-sponsor",
    benefits: [
      "Naming rights on flagship tournaments",
      "Premium logo placement club-wide",
      "Dedicated social media features",
    ],
    description: null,
    isHighlighted: true,
    reachStats: "40,000+ members · 2,000+ daily visitors",
    title: "Title Sponsor",
  },
  {
    _id: "placeholder-event-partner",
    benefits: [
      "Branding at select tournaments and leagues",
      "On-ground signage and banners",
      "Mention in event communications",
    ],
    description: null,
    isHighlighted: false,
    reachStats: "Reach event-day attendees and participants",
    title: "Event Partner",
  },
  {
    _id: "placeholder-digital-partner",
    benefits: [
      "Logo on gsc.in and email newsletters",
      "Featured placement on social channels",
      "Ongoing digital presence, year-round",
    ],
    description: null,
    isHighlighted: false,
    reachStats: "Always-on visibility across digital channels",
    title: "Digital Partner",
  },
];

interface PartnershipOpportunitiesGridProps {
  opportunities: PartnershipOpportunity[];
}

export function PartnershipOpportunitiesGrid({
  opportunities,
}: PartnershipOpportunitiesGridProps) {
  const displayOpportunities =
    opportunities.length > 0 ? opportunities : PLACEHOLDER_OPPORTUNITIES;

  return (
    <SectionWrapper className="bg-(--color-surface)">
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Partnership Opportunities
        </AnimatedText>
        <p className="mt-3 max-w-2xl text-(--color-text-secondary)">
          Choose the tier that fits your brand's goals.
        </p>
      </div>
      <StaggerReveal className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
        {displayOpportunities.map((opportunity) => (
          <div
            className={cn(
              "flex flex-col gap-4 rounded-2xl border bg-(--color-bg) p-6 md:p-8",
              opportunity.isHighlighted
                ? "border-accent-gold/40"
                : "border-(--color-border)"
            )}
            key={opportunity._id}
          >
            <div>
              <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
                {opportunity.title}
              </h3>
              {opportunity.reachStats ? (
                <p className="mt-2 font-medium text-primary text-sm">
                  {opportunity.reachStats}
                </p>
              ) : null}
            </div>
            {opportunity.description ? (
              <p className="text-(--color-text-secondary) text-sm">
                {getPortableTextSnippet(opportunity.description, 160)}
              </p>
            ) : null}
            {opportunity.benefits.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {opportunity.benefits.map((benefit) => (
                  <li
                    className="flex items-start gap-2 text-(--color-text-secondary) text-sm"
                    key={benefit}
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-primary"
                      size={16}
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            ) : null}
            <Button className="mt-auto" href="#inquiry">
              Inquire Now
            </Button>
          </div>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}
