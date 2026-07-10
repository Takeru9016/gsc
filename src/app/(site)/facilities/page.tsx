import type { Metadata } from "next";
import { FacilitiesStatsBar } from "@/components/sections/facilities/FacilitiesStatsBar.tsx";
import { FacilityCategoryGrid } from "@/components/sections/facilities/FacilityCategoryGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "18 guest rooms, 3 banquet halls, 6 dining venues, and more at Goregaon Sports Club.",
    title: "Facilities | Goregaon Sports Club",
  };
}

export default function FacilitiesPage() {
  return (
    <>
      <PageHero
        headline="World-Class Facilities"
        subline="Rooms, banquets, dining, and recreation — everything a member needs."
      />
      <FacilitiesStatsBar />
      <FacilityCategoryGrid />
    </>
  );
}
