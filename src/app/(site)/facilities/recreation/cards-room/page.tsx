import type { Metadata } from "next";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { RecreationMembershipNote } from "@/components/sections/facilities/RecreationMembershipNote.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "A members-only room for classic card games at Goregaon Sports Club.",
    title: "Cards Room | Facilities | Goregaon Sports Club",
  };
}

export default function CardsRoomPage() {
  return (
    <>
      <PageHero
        headline="Cards Room"
        subline="A quiet, members-only room for classic card games."
      />
      <RecreationAbout
        paragraphs={[
          "[PENDING_CONTENT] — Games available in the Cards Room, to be confirmed by the facility manager.",
          "[PENDING_CONTENT] — House rules summary, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="[PENDING_CONTENT] — Operating hours, to be confirmed by the facility manager."
        title="Timings"
      />
      <RecreationMembershipNote note="Members only facility." />
    </>
  );
}
