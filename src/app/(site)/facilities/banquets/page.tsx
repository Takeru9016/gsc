import type { Metadata } from "next";
import { BanquetHallGrid } from "@/components/sections/facilities/BanquetHallGrid.tsx";
import { BanquetInquiryCTA } from "@/components/sections/facilities/BanquetInquiryCTA.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getBanquetHalls } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "3 premium event venues for every occasion.",
    title: "Banquet Halls | Facilities | Goregaon Sports Club",
  };
}

export default async function BanquetsPage() {
  const halls = await getBanquetHalls();

  return (
    <>
      <PageHero
        headline="Banquet Halls"
        subline="3 premium venues for every occasion."
      />
      <BanquetHallGrid halls={halls} />
      <BanquetInquiryCTA />
    </>
  );
}
