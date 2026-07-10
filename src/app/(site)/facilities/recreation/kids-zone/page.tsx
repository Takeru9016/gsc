import type { Metadata } from "next";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { RecreationMembershipNote } from "@/components/sections/facilities/RecreationMembershipNote.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description:
      "A supervised play area for members' children at Goregaon Sports Club.",
    title: "Kids Zone | Facilities | Goregaon Sports Club",
  };
}

export default function KidsZonePage() {
  return (
    <>
      <PageHero
        headline="Kids Zone"
        subline="A safe, supervised play area for our youngest members."
      />
      <RecreationAbout
        paragraphs={[
          "[PENDING_CONTENT] — Activities and equipment available in the Kids Zone, to be confirmed by the facility manager.",
          "[PENDING_CONTENT] — Supervision arrangements and safety guidelines, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="[PENDING_CONTENT] — Age range and operating hours, to be confirmed by the facility manager."
        title="Timings"
      />
      <RecreationMembershipNote note="Available to members and their children." />
    </>
  );
}
