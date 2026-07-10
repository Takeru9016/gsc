import type { Metadata } from "next";
import { LeagueFilters } from "@/components/sections/events/LeagueFilters.tsx";
import { LeaguesGrid } from "@/components/sections/events/LeaguesGrid.tsx";
import { LeaguesParticipateCTA } from "@/components/sections/events/LeaguesParticipateCTA.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getLeaguesConfig, type League } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description:
      "18 competitive leagues across 12+ sports at Goregaon Sports Club.",
    title: "Leagues | Events | Goregaon Sports Club",
  };
}

// [PENDING_CONTENT] — placeholders for the 6 most prominent leagues until the
// leaguesConfig singleton is populated in Sanity.
const PLACEHOLDER_LEAGUES: League[] = [
  {
    approximateDates: "March – April",
    description:
      "Mumbai's most competitive T20 cricket league, played across the GSC ground with 16 participating teams.",
    format: "T20",
    frequency: "Annual",
    isActive: true,
    name: "Cricket T20 League",
    sport: "Cricket",
  },
  {
    approximateDates: "June – July",
    description:
      "Singles badminton championship open to all skill levels, run across the indoor courts.",
    format: "Singles",
    frequency: "Annual",
    isActive: true,
    name: "Badminton Singles Championship",
    sport: "Badminton",
  },
  {
    approximateDates: "October",
    description:
      "Individual and relay swimming meet across all age categories in the GSC pool.",
    format: "Individual & Relay",
    frequency: "Annual",
    isActive: false,
    name: "Swimming Meet",
    sport: "Swimming",
  },
  {
    approximateDates: "January & August",
    description:
      "Singles lawn tennis league held twice a year on the club's clay courts.",
    format: "Singles",
    frequency: "Biannual",
    isActive: true,
    name: "Lawn Tennis Singles League",
    sport: "Lawn Tennis",
  },
  {
    approximateDates: "September",
    description:
      "Singles and doubles table tennis championship for members of all ages.",
    format: "Singles & Doubles",
    frequency: "Annual",
    isActive: false,
    name: "Table Tennis Championship",
    sport: "Table Tennis",
  },
  {
    approximateDates: "December",
    description:
      "Individual chess championship crowning GSC's club champion each year.",
    format: "Individual",
    frequency: "Annual",
    isActive: false,
    name: "Chess Championship",
    sport: "Chess",
  },
];

interface LeaguesPageProps {
  searchParams: Promise<{ sport?: string }>;
}

export default async function LeaguesPage({ searchParams }: LeaguesPageProps) {
  const [leaguesConfig, resolvedSearchParams] = await Promise.all([
    getLeaguesConfig(),
    searchParams,
  ]);

  const leagues =
    leaguesConfig && leaguesConfig.leagues.length > 0
      ? leaguesConfig.leagues
      : PLACEHOLDER_LEAGUES;

  const activeSport = resolvedSearchParams.sport ?? "";
  const sports = Array.from(
    new Set(leagues.map((league) => league.sport))
  ).sort();

  return (
    <>
      <PageHero
        headline="GSC Leagues"
        subline="18 competitive leagues across 12+ sports."
      />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <LeagueFilters sports={sports} />
        </div>
        <LeaguesGrid activeSport={activeSport} leagues={leagues} />
      </SectionWrapper>
      <LeaguesParticipateCTA />
    </>
  );
}
