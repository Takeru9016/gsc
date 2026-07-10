import type { Metadata } from "next";
import { RecreationCategoryGrid } from "@/components/sections/facilities/RecreationCategoryGrid.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "Kids zone, cards room, and housie nights — leisure facilities for GSC members.",
    title: "Recreation & Leisure | Facilities | Goregaon Sports Club",
  };
}

export default function RecreationPage() {
  return (
    <>
      <PageHero
        headline="Recreation & Leisure"
        subline="Kids zone, cards room, and housie nights — leisure for every member."
      />
      <RecreationCategoryGrid />
    </>
  );
}
