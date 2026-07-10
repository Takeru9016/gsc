import type { Metadata } from "next";
import { MedicalEmergencyContacts } from "@/components/sections/facilities/MedicalEmergencyContacts.tsx";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getSiteConfig } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "On-site medical support for members at Goregaon Sports Club.",
    title: "Medical Cell | Facilities | Goregaon Sports Club",
  };
}

export default async function MedicalCellPage() {
  const siteConfig = await getSiteConfig();

  return (
    <>
      <PageHero
        headline="Medical Cell"
        subline="On-site medical support for members."
      />
      <RecreationAbout
        paragraphs={[
          "[PENDING_CONTENT] — Facilities and equipment available at the Medical Cell, to be confirmed by the facility manager.",
          "[PENDING_CONTENT] — Purpose and scope of on-site medical support, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="Doctor on duty schedule available at the reception."
        title="Doctor Schedule"
      />
      <MedicalEmergencyContacts siteConfig={siteConfig} />
    </>
  );
}
