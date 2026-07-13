import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SportAbout } from "@/components/sections/sports/SportAbout.tsx";
import { SportAchievements } from "@/components/sections/sports/SportAchievements.tsx";
import { SportBookingCTA } from "@/components/sections/sports/SportBookingCTA.tsx";
import { SportCoaching } from "@/components/sections/sports/SportCoaching.tsx";
import { SportHeroObject } from "@/components/sections/sports/SportHeroObject.tsx";
import { SportSchedule } from "@/components/sections/sports/SportSchedule.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { client } from "@/lib/sanity/client.ts";
import { getAchievements, getSportBySlug } from "@/lib/sanity/queries.ts";
import { getSportCategoryLabel } from "@/lib/sportCategories.ts";

interface SportDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sports = await client.fetch<{ slug: string }[]>(
    `*[_type == "sport"] { "slug": slug.current }`,
    {},
    { next: { tags: ["sports"] } }
  );

  return sports.map((sport) => ({ slug: sport.slug }));
}

export async function generateMetadata({
  params,
}: SportDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  if (!sport) {
    return { title: "Sport Not Found | Goregaon Sports Club" };
  }

  return {
    description: sport.metaDescription ?? sport.shortDescription,
    title: sport.metaTitle ?? `${sport.name} | Goregaon Sports Club`,
  };
}

export default async function SportDetailPage({
  params,
}: SportDetailPageProps) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  if (!sport) {
    notFound();
  }

  const achievements = await getAchievements({ sport: slug });

  return (
    <>
      <PageHero
        badge={getSportCategoryLabel(sport.category)}
        headline={sport.name}
        image={sport.heroImage ?? undefined}
        subline={sport.shortDescription}
      >
        {sport.threeObjectType === "none" ? null : (
          <SportHeroObject threeObjectType={sport.threeObjectType} />
        )}
      </PageHero>
      <SportAbout
        facilityDetails={sport.facilityDetails}
        fullDescription={sport.fullDescription}
      />
      <SportSchedule schedule={sport.schedule} />
      {sport.hasCoaching ? (
        <SportCoaching
          coachingLevel={sport.coachingLevel}
          coachingSchedule={sport.coachingSchedule}
          coachName={sport.coachName}
          externalRegistrationUrl={sport.externalRegistrationUrl}
        />
      ) : null}
      {achievements.length > 0 ? (
        <SportAchievements
          achievements={achievements.slice(0, 3)}
          sportName={sport.name}
          sportSlug={sport.slug}
        />
      ) : null}
      <SportBookingCTA sportName={sport.name} sportSlug={sport.slug} />
    </>
  );
}
