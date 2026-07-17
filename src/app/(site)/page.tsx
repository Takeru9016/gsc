import { AchievementsReel } from "@/components/sections/home/AchievementsReel.tsx";
import { EventsPreview } from "@/components/sections/home/EventsPreview.tsx";
import { FacilitiesShowcase } from "@/components/sections/home/FacilitiesShowcase.tsx";
import { HeroSection } from "@/components/sections/home/HeroSection.tsx";
import { MembershipCTA } from "@/components/sections/home/MembershipCTA.tsx";
import { PartnersStrip } from "@/components/sections/home/PartnersStrip.tsx";
import { SportsGrid } from "@/components/sections/home/SportsGrid.tsx";
import { StatsBar } from "@/components/sections/home/StatsBar.tsx";
import { getEvents, getSiteConfig } from "@/lib/sanity/queries.ts";

export default async function Home() {
  const [siteConfig, upcomingEvents] = await Promise.all([
    getSiteConfig(),
    getEvents("upcoming"),
  ]);

  return (
    <>
      <HeroSection siteConfig={siteConfig} />
      <StatsBar />
      <SportsGrid />
      <FacilitiesShowcase />
      <EventsPreview events={upcomingEvents} />
      <AchievementsReel />
      <MembershipCTA />
      <PartnersStrip partners={siteConfig.corporatePartners} />
    </>
  );
}
