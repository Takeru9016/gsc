import type { Metadata } from "next";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "A quiet reading room and book collection at Goregaon Sports Club.",
    title: "Club Library | Facilities | Goregaon Sports Club",
  };
}

export default function LibraryPage() {
  return (
    <>
      <PageHero
        headline="Club Library"
        subline="A quiet space to read and unwind."
      />
      <RecreationAbout
        paragraphs={[
          "[PENDING_CONTENT] — Collection size and genres available, to be confirmed by the facility manager.",
          "[PENDING_CONTENT] — Reading room seating and ambience details, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="[PENDING_CONTENT] — Operating hours, to be confirmed by the facility manager."
        title="Hours"
      />
    </>
  );
}
