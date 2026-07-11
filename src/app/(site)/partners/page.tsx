import type { Metadata } from "next";
import { CurrentPartnersGrid } from "@/components/sections/partners/CurrentPartnersGrid.tsx";
import { PartnerInquirySection } from "@/components/sections/partners/PartnerInquirySection.tsx";
import { PartnershipOpportunitiesGrid } from "@/components/sections/partners/PartnershipOpportunitiesGrid.tsx";
import { TeamSpiritCTA } from "@/components/sections/partners/TeamSpiritCTA.tsx";
import { WhyPartnerCards } from "@/components/sections/partners/WhyPartnerCards.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import {
  getPartnershipOpportunities,
  getSiteConfig,
} from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "Reach 40,000+ members and 2,000+ daily visitors.",
    title: "Partner With Us | Goregaon Sports Club",
  };
}

export default async function PartnersPage() {
  const [opportunities, siteConfig] = await Promise.all([
    getPartnershipOpportunities(),
    getSiteConfig(),
  ]);

  return (
    <>
      <PageHero
        headline="Partner With GSC"
        subline="Reach 40,000+ members and 2,000+ daily visitors."
      />
      <WhyPartnerCards />
      <PartnershipOpportunitiesGrid opportunities={opportunities} />
      <TeamSpiritCTA />
      <PartnerInquirySection />
      <CurrentPartnersGrid partners={siteConfig.corporatePartners} />
    </>
  );
}
