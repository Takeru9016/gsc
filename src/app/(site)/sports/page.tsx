import type { Metadata } from "next";
import { CoachingCTA } from "@/components/sections/sports/CoachingCTA.tsx";
import { SportsCategoryGrid } from "@/components/sections/sports/SportsCategoryGrid.tsx";
import { SportsScrollFallback } from "@/components/sections/sports/SportsScrollFallback.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { WebGLOnly } from "@/components/three/WebGLDetector.tsx";
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
      {/* WebGL scroll scenes ship in Tasks 3-05 through 3-08; the fallback is the desktop experience until then */}
      <WebGLOnly fallback={<SportsScrollFallback sports={sports} />}>
        <SportsScrollFallback sports={sports} />
      </WebGLOnly>
      <SportsCategoryGrid sports={sports} />
      <CoachingCTA />
    </>
  );
}
