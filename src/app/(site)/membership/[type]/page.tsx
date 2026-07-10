import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MembershipBenefits } from "@/components/sections/membership/MembershipBenefits.tsx";
import { MembershipEligibility } from "@/components/sections/membership/MembershipEligibility.tsx";
import { MembershipInterestSection } from "@/components/sections/membership/MembershipInterestSection.tsx";
import { MembershipYearlyNote } from "@/components/sections/membership/MembershipYearlyNote.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { MEMBERSHIP_TYPES_FALLBACK } from "@/lib/membershipTypes.ts";
import {
  getMembershipConfig,
  getMembershipTypeBySlug,
} from "@/lib/sanity/queries.ts";

interface MembershipTypePageProps {
  params: Promise<{ type: string }>;
}

const VALID_SLUGS = new Set(
  MEMBERSHIP_TYPES_FALLBACK.map((membershipType) => membershipType.slug)
);

export function generateStaticParams() {
  return MEMBERSHIP_TYPES_FALLBACK.map((membershipType) => ({
    type: membershipType.slug,
  }));
}

export async function generateMetadata({
  params,
}: MembershipTypePageProps): Promise<Metadata> {
  const { type } = await params;
  const fallback = MEMBERSHIP_TYPES_FALLBACK.find(
    (membershipTypeFallback) => membershipTypeFallback.slug === type
  );

  if (!fallback) {
    return { title: "Membership Type Not Found | Goregaon Sports Club" };
  }

  const membershipType = await getMembershipTypeBySlug(type);

  return {
    description: membershipType?.tagline ?? fallback.tagline,
    title: `${membershipType?.title ?? fallback.title} | Goregaon Sports Club`,
  };
}

export default async function MembershipTypePage({
  params,
}: MembershipTypePageProps) {
  const { type } = await params;

  if (!VALID_SLUGS.has(type)) {
    notFound();
  }

  const fallback = MEMBERSHIP_TYPES_FALLBACK.find(
    (membershipTypeFallback) => membershipTypeFallback.slug === type
  );

  if (!fallback) {
    notFound();
  }

  const [membershipType, membershipConfig] = await Promise.all([
    getMembershipTypeBySlug(type),
    getMembershipConfig(),
  ]);

  const title = membershipType?.title ?? fallback.title;
  const tagline = membershipType?.tagline ?? fallback.tagline;
  const enrollmentOpen = membershipConfig?.enrollmentOpen ?? false;

  return (
    <>
      <PageHero
        badge={enrollmentOpen ? "Enrollment Open" : "Enrollment Paused"}
        headline={title}
        subline={tagline}
      />
      <MembershipEligibility
        eligibility={membershipType?.eligibility ?? null}
        typeTitle={title}
      />
      <MembershipBenefits
        benefits={membershipType?.benefits ?? null}
        typeTitle={title}
      />
      {type === "yearly" ? <MembershipYearlyNote /> : null}
      <MembershipInterestSection
        enrollmentNotice={membershipConfig?.enrollmentNotice ?? null}
        membershipType={type}
        membershipTypeLabel={title}
      />
      <SectionWrapper className="pt-0">
        <Link
          className="text-primary transition-all duration-200 hover:underline"
          href="/membership"
        >
          ← Back to Membership
        </Link>
      </SectionWrapper>
    </>
  );
}
