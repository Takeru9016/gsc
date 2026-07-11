import type { Metadata } from "next";
import { AchievementFilters } from "@/components/sections/achievements/AchievementFilters.tsx";
import { AchievementSubmitCTA } from "@/components/sections/achievements/AchievementSubmitCTA.tsx";
import { AchievementsGrid } from "@/components/sections/achievements/AchievementsGrid.tsx";
import type { DisplayAchievement } from "@/components/shared/AchievementCard.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getAchievements } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "Celebrating GSC athletes across decades.",
    title: "Our Champions | Goregaon Sports Club",
  };
}

// [PENDING_CONTENT] — placeholders shown until approved achievements exist in Sanity.
const PLACEHOLDER_ACHIEVEMENTS: DisplayAchievement[] = [
  {
    _id: "placeholder-1",
    description: "Won gold in the 100m freestyle at the state meet.",
    image: null,
    level: "State",
    memberName: "Aarav Mehta",
    sport: "Swimming",
    title: "State Swimming Championship 2023",
    type: "Individual",
    year: 2023,
  },
  {
    _id: "placeholder-2",
    description: "Runners-up in the national badminton doubles final.",
    image: null,
    level: "National",
    memberName: "Rhea Kapoor",
    sport: "Badminton",
    title: "National Badminton Doubles 2023",
    type: "Team",
    year: 2023,
  },
  {
    _id: "placeholder-3",
    description: "Club team clinched the district T20 league title.",
    image: null,
    level: "District",
    memberName: null,
    sport: "Cricket",
    title: "District T20 League Winners 2022",
    type: "Team",
    year: 2022,
  },
  {
    _id: "placeholder-4",
    description: "Represented India at the international chess open.",
    image: null,
    level: "International",
    memberName: "Vivaan Shah",
    sport: "Chess",
    title: "International Chess Open 2022",
    type: "Individual",
    year: 2022,
  },
  {
    _id: "placeholder-5",
    description: "Singles champion at the state lawn tennis championship.",
    image: null,
    level: "State",
    memberName: "Ishaan Rao",
    sport: "Tennis",
    title: "State Lawn Tennis Championship 2021",
    type: "Individual",
    year: 2021,
  },
  {
    _id: "placeholder-6",
    description: "Bronze medal at the national squash championship.",
    image: null,
    level: "National",
    memberName: "Myra Iyer",
    sport: "Squash",
    title: "National Squash Championship 2021",
    type: "Individual",
    year: 2021,
  },
  {
    _id: "placeholder-7",
    description: "Club side won the district table tennis league.",
    image: null,
    level: "District",
    memberName: null,
    sport: "Table Tennis",
    title: "District Table Tennis League 2020",
    type: "Team",
    year: 2020,
  },
  {
    _id: "placeholder-8",
    description: "Gold at the state athletics meet in the 4x100m relay.",
    image: null,
    level: "State",
    memberName: null,
    sport: "Athletics",
    title: "State Athletics Meet 2020",
    type: "Team",
    year: 2020,
  },
];

interface AchievementsPageProps {
  searchParams: Promise<{
    level?: string;
    sport?: string;
    type?: string;
    year?: string;
  }>;
}

export default async function AchievementsPage({
  searchParams,
}: AchievementsPageProps) {
  const [achievements, resolvedSearchParams] = await Promise.all([
    getAchievements(),
    searchParams,
  ]);

  const displayAchievements: DisplayAchievement[] =
    achievements.length > 0 ? achievements : PLACEHOLDER_ACHIEVEMENTS;

  const sports = Array.from(
    new Set(displayAchievements.map((achievement) => achievement.sport))
  ).sort();
  const years = Array.from(
    new Set(displayAchievements.map((achievement) => achievement.year))
  ).sort((a, b) => b - a);

  return (
    <>
      <PageHero
        headline="Our Champions"
        subline="Celebrating GSC athletes across decades."
      />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <AchievementFilters sports={sports} years={years} />
        </div>
        <AchievementsGrid
          achievements={displayAchievements}
          activeLevel={resolvedSearchParams.level ?? ""}
          activeSport={resolvedSearchParams.sport ?? ""}
          activeType={resolvedSearchParams.type ?? ""}
          activeYear={resolvedSearchParams.year ?? ""}
        />
      </SectionWrapper>
      <SectionWrapper>
        <AchievementSubmitCTA />
      </SectionWrapper>
    </>
  );
}
