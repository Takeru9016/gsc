import type { Metadata } from "next";
import { RecreationAbout } from "@/components/sections/facilities/RecreationAbout.tsx";
import { RecreationDownloadsCTA } from "@/components/sections/facilities/RecreationDownloadsCTA.tsx";
import { RecreationInfoSection } from "@/components/sections/facilities/RecreationInfoSection.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";

export function generateMetadata(): Metadata {
  return {
    description: "Housie (tambola) nights at Goregaon Sports Club.",
    title: "Housie Nights | Facilities | Goregaon Sports Club",
  };
}

export default function HousiePage() {
  return (
    <>
      <PageHero
        headline="Housie Nights"
        subline="Tambola nights with the GSC community — cards, calls, and prizes."
      />
      <RecreationAbout
        paragraphs={[
          "Housie, also known as tambola or bingo, is a numbers game played with tickets and called-out numbers — a longstanding social tradition at GSC.",
          "[PENDING_CONTENT] — Format details and prize structure, to be confirmed by the facility manager.",
        ]}
      />
      <RecreationInfoSection
        content="Schedule announced monthly. Check the downloads section for the latest notice."
        title="Schedule"
      />
      <RecreationDownloadsCTA />
    </>
  );
}
