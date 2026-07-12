import type { Metadata } from "next";
import { CoachingCTA } from "@/components/sections/sports/CoachingCTA.tsx";
import { SportsCategoryGrid } from "@/components/sections/sports/SportsCategoryGrid.tsx";
import { SportsScrollWebGL } from "@/components/sections/sports/SportsScrollWebGL.tsx";
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
      {/* Scene 1 (Cricket) ships in Task 3-05; Scenes 2-6 ship in Tasks 3-06 through 3-08 */}
      <SportsScrollWebGL sports={sports} />
      <SportsCategoryGrid sports={sports} />
      <CoachingCTA />
    </>
  );
}
