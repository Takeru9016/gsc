import type { Metadata } from "next";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "Relax and unwind at the GSC Massage Chair Area — formerly the Massage Center.",
    title: "Massage Chair Area | Facilities | Goregaon Sports Club",
  };
}

export default function MassageChairsPage() {
  return (
    <>
      <PageHero
        headline="Massage Chair Area"
        subline="Relax and unwind after your workout."
      />
      <RecreationAbout
        paragraphs={[
          "[PENDING_CONTENT] — Number and models of massage chairs available, to be confirmed by the facility manager.",
          "[PENDING_CONTENT] — Session duration and pricing or token system, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="[PENDING_CONTENT] — Operating hours, to be confirmed by the facility manager."
        title="Hours"
      />
    </>
  );
}
