import type { Metadata } from "next";
import { CoachingCTA } from "@/components/sections/sports/CoachingCTA.tsx";
import { SportsCategoryGrid } from "@/components/sections/sports/SportsCategoryGrid.tsx";
import { SportsScrollExperience } from "@/components/sections/sports/SportsScrollExperience.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getSports } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description:
      "23+ sports, one club. Explore Goregaon Sports Club's outdoor, indoor, aquatic, health, and track disciplines.",
    title: "Sports | Goregaon Sports Club",
  };
}

export default async function SportsPage() {
  const sports = await getSports();

  return (
    <>
      <PageHero headline="23+ Sports. One Club." />
      <SportsScrollExperience sports={sports} />
      <SportsCategoryGrid sports={sports} />
      <CoachingCTA />
    </>
  );
}
