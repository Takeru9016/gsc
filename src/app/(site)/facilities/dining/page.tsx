import type { Metadata } from "next";
import { DiningVenueGrid } from "@/components/sections/facilities/DiningVenueGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getDiningVenues } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "6 restaurants and cafes, from fine dining to casual bites.",
    title: "Dining | Facilities | Goregaon Sports Club",
  };
}

export default async function DiningPage() {
  const venues = await getDiningVenues();

  return (
    <>
      <PageHero
        headline="Dining at GSC"
        subline="6 restaurants and cafes, from fine dining to casual bites."
      />
      <DiningVenueGrid venues={venues} />
    </>
  );
}
