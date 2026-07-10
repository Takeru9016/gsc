import type { Metadata } from "next";
import { ByeLawsCTA } from "@/components/sections/about/ByeLawsCTA.tsx";
import { HistorySection } from "@/components/sections/about/HistorySection.tsx";
import { LeadershipSection } from "@/components/sections/about/LeadershipSection.tsx";
import { MilestonesTimeline } from "@/components/sections/about/MilestonesTimeline.tsx";
import { StatsBar } from "@/components/sections/home/StatsBar.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getMilestones } from "@/lib/sanity/queries.ts";

// [PENDING_CONTENT] — replace with metaDescription from the `aboutPage`
// Sanity singleton once that schema exists.
const DEFAULT_DESCRIPTION =
  "30+ Years of Sporting Excellence in Mumbai — the history, leadership, and legacy of Goregaon Sports Club.";

export function generateMetadata(): Metadata {
  return {
    description: DEFAULT_DESCRIPTION,
    title: "About | Goregaon Sports Club",
  };
}

export default async function AboutPage() {
  const milestones = await getMilestones();

  return (
    <>
      <PageHero
        headline="About GSC"
        subline="30+ Years of Sporting Excellence in Mumbai"
      />
      <HistorySection />
      <StatsBar />
      <MilestonesTimeline milestones={milestones} />
      <LeadershipSection />
      <ByeLawsCTA />
    </>
  );
}
