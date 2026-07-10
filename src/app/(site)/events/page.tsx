import type { Metadata } from "next";
import { EventFilters } from "@/components/sections/events/EventFilters.tsx";
import { EventsGrid } from "@/components/sections/events/EventsGrid.tsx";
import { EventsLeaguesCTA } from "@/components/sections/events/EventsLeaguesCTA.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getEvents } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description:
      "Tournaments, leagues, and celebrations at Goregaon Sports Club.",
    title: "Events | Goregaon Sports Club",
  };
}

interface EventsPageProps {
  searchParams: Promise<{ status?: string; type?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const [events, resolvedSearchParams] = await Promise.all([
    getEvents(),
    searchParams,
  ]);
  const activeStatus = resolvedSearchParams.status ?? "";
  const activeType = resolvedSearchParams.type ?? "";

  return (
    <>
      <PageHero
        headline="Events at GSC"
        subline="Tournaments, leagues, and celebrations."
      />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <EventFilters />
        </div>
        <EventsGrid
          activeStatus={activeStatus}
          activeType={activeType}
          events={events}
        />
      </SectionWrapper>
      <EventsLeaguesCTA />
    </>
  );
}
