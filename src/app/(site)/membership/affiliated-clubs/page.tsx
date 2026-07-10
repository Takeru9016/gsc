import type { Metadata } from "next";
import { AffiliatedClubsAbout } from "@/components/sections/membership/AffiliatedClubsAbout.tsx";
import { AffiliatedClubsList } from "@/components/sections/membership/AffiliatedClubsList.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getMembershipConfig } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "GSC's reciprocal membership benefits.",
    title: "Affiliated Club Members | Goregaon Sports Club",
  };
}

export default async function AffiliatedClubsPage() {
  const membershipConfig = await getMembershipConfig();

  return (
    <>
      <PageHero
        headline="Affiliated Club Members"
        subline="GSC's reciprocal membership benefits."
      />
      <AffiliatedClubsAbout />
      <AffiliatedClubsList clubs={membershipConfig?.affiliatedClubs ?? []} />
    </>
  );
}
