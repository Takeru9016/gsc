import type { Metadata } from "next";
import { CoachingContactCTA } from "@/components/sections/sports/CoachingContactCTA.tsx";
import { CoachingFilter } from "@/components/sections/sports/CoachingFilter.tsx";
import { CoachingGrid } from "@/components/sections/sports/CoachingGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getCoachingSports } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "Expert coaching across 10+ disciplines.",
    title: "Coaching Programs | Sports | Goregaon Sports Club",
  };
}

interface CoachingPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function CoachingPage({
  searchParams,
}: CoachingPageProps) {
  const [sports, resolvedSearchParams] = await Promise.all([
    getCoachingSports(),
    searchParams,
  ]);
  const activeCategory = resolvedSearchParams.category ?? "";

  return (
    <>
      <PageHero
        headline="Coaching Programs"
        subline="Expert coaching across 10+ disciplines."
      />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <CoachingFilter />
        </div>
        <CoachingGrid activeCategory={activeCategory} sports={sports} />
      </SectionWrapper>
      <CoachingContactCTA />
    </>
  );
}
