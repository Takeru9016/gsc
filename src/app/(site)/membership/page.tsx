import type { Metadata } from "next";
import { AffiliatedClubsCTA } from "@/components/sections/membership/AffiliatedClubsCTA.tsx";
import { EnrollmentBanner } from "@/components/sections/membership/EnrollmentBanner.tsx";
import { MembershipTypeGrid } from "@/components/sections/membership/MembershipTypeGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import {
  getMembershipConfig,
  getMembershipTypes,
} from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "12,000+ members. A legacy 30 years strong.",
    title: "Membership | Goregaon Sports Club",
  };
}

export default async function MembershipPage() {
  const [membershipConfig, membershipTypes] = await Promise.all([
    getMembershipConfig(),
    getMembershipTypes(),
  ]);

  return (
    <>
      <PageHero
        headline="Join the GSC Family"
        subline="12,000+ members. A legacy 30 years strong."
      />
      <EnrollmentBanner membershipConfig={membershipConfig} />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-body font-semibold text-(--color-text-primary) text-4xl">
            Membership Types
          </h2>
          <p className="mt-2 text-(--color-text-secondary)">
            Choose the tier that fits you and express your interest.
          </p>
        </div>
        <MembershipTypeGrid membershipTypes={membershipTypes} />
      </SectionWrapper>
      <AffiliatedClubsCTA />
    </>
  );
}
