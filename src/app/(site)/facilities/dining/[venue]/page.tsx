import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiningVenueAbout } from "@/components/sections/facilities/DiningVenueAbout.tsx";
import { DiningVenueAgeDisclaimer } from "@/components/sections/facilities/DiningVenueAgeDisclaimer.tsx";
import { DiningVenueGallery } from "@/components/sections/facilities/DiningVenueGallery.tsx";
import { DiningVenueHours } from "@/components/sections/facilities/DiningVenueHours.tsx";
import { DiningVenueMenu } from "@/components/sections/facilities/DiningVenueMenu.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getDiningVenueTypeMeta } from "@/lib/diningVenueType.ts";
import {
  getDiningVenueBySlug,
  getDiningVenues,
  type OpeningHoursEntry,
} from "@/lib/sanity/queries.ts";

interface DiningVenuePageProps {
  params: Promise<{ venue: string }>;
}

const VENUE_SLUGS_FALLBACK = [
  "golden-peacock",
  "water-front-cafe",
  "bleu-restobar",
  "flavours",
  "cookie-dough-cafe",
  "food-court",
];

function getHoursSummary(openingHours: OpeningHoursEntry[]): string | null {
  if (openingHours.length === 0) {
    return null;
  }

  const [firstEntry] = openingHours;
  const allHoursMatch = openingHours.every(
    (entry) => entry.hours === firstEntry.hours
  );

  return allHoursMatch ? `Daily: ${firstEntry.hours}` : "Hours vary by day";
}

export async function generateStaticParams() {
  const venues = await getDiningVenues();
  const slugs =
    venues.length > 0 ? venues.map((v) => v.slug) : VENUE_SLUGS_FALLBACK;

  return slugs.map((venue) => ({ venue }));
}

export async function generateMetadata({
  params,
}: DiningVenuePageProps): Promise<Metadata> {
  const { venue } = await params;
  const diningVenue = await getDiningVenueBySlug(venue);

  if (!diningVenue) {
    return { title: "Venue Not Found | Goregaon Sports Club" };
  }

  return {
    description:
      diningVenue.metaDescription ??
      diningVenue.tagline ??
      "6 restaurants and cafes, from fine dining to casual bites.",
    title:
      diningVenue.metaTitle ?? `${diningVenue.name} | Goregaon Sports Club`,
  };
}

export default async function DiningVenuePage({
  params,
}: DiningVenuePageProps) {
  const { venue } = await params;
  const diningVenue = await getDiningVenueBySlug(venue);

  if (!diningVenue) {
    notFound();
  }

  const typeMeta = getDiningVenueTypeMeta(diningVenue.type);
  const hoursSummary = getHoursSummary(diningVenue.openingHours);

  return (
    <>
      <PageHero
        badge={typeMeta.label}
        headline={diningVenue.name}
        image={diningVenue.heroImage ?? undefined}
        subline={diningVenue.tagline ?? undefined}
      >
        {hoursSummary ? <Badge variant="outline">{hoursSummary}</Badge> : null}
        {diningVenue.hasBar ? (
          <Badge variant="red">
            {diningVenue.ageRestriction ?? 25}+ | Bar Available
          </Badge>
        ) : null}
      </PageHero>
      {diningVenue.hasBar ? <DiningVenueAgeDisclaimer /> : null}
      <DiningVenueAbout
        cuisineType={diningVenue.cuisineType}
        description={diningVenue.description}
        seatingCapacity={diningVenue.seatingCapacity}
      />
      <DiningVenueMenu
        barMenuPdf={diningVenue.barMenuPdf}
        hasBar={diningVenue.hasBar}
        menuPdf={diningVenue.menuPdf}
      />
      <DiningVenueGallery
        gallery={diningVenue.gallery}
        venueName={diningVenue.name}
      />
      <DiningVenueHours
        openingHours={diningVenue.openingHours}
        reservationInfo={diningVenue.reservationInfo}
      />
    </>
  );
}
