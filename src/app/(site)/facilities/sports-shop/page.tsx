import type { Metadata } from "next";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "Sporting equipment, apparel, and accessories available at the GSC Sports Shop.",
    title: "Sports Shop | Facilities | Goregaon Sports Club",
  };
}

export default function SportsShopPage() {
  return (
    <>
      <PageHero
        headline="Sports Shop"
        subline="Equipment, apparel, and accessories for every sport at GSC."
      />
      <RecreationAbout
        paragraphs={[
          "[PENDING_CONTENT] — Range of equipment, apparel, and accessories stocked, to be confirmed by the facility manager.",
          "[PENDING_CONTENT] — Brands carried and custom ordering options, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="[PENDING_CONTENT] — Operating hours and location within the club premises, to be confirmed by the facility manager."
        title="Hours & Location"
      />
    </>
  );
}
