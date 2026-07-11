import type { Metadata } from "next";
import { TeamSpiritAbout } from "@/components/sections/partners/TeamSpiritAbout.tsx";
import { TeamSpiritAdvertiseSection } from "@/components/sections/partners/TeamSpiritAdvertiseSection.tsx";
import { TeamSpiritEditionsGrid } from "@/components/sections/partners/TeamSpiritEditionsGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getTeamSpiritEditions } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description:
      "GSC's member magazine, published 3 times a year — Summer, Diwali, and New Year editions.",
    title: "Team Spirit Magazine | Partners | Goregaon Sports Club",
  };
}

export default async function TeamSpiritPage() {
  const editions = await getTeamSpiritEditions();

  return (
    <>
      <PageHero
        headline="Team Spirit"
        subline="GSC's Member Magazine — 3 Editions Per Year."
      />
      <TeamSpiritAbout />
      <TeamSpiritEditionsGrid editions={editions} />
      <TeamSpiritAdvertiseSection latestEdition={editions[0]} />
    </>
  );
}
