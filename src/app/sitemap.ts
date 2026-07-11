import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client.ts";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gsc.in").replace(
  /\/+$/,
  ""
);

const STATIC_ROUTES = [
  "",
  "/about",
  "/about/team",
  "/about/bye-laws",
  "/contact",
  "/sports",
  "/sports/coaching",
  "/events",
  "/events/leagues",
  "/facilities",
  "/facilities/rooms",
  "/facilities/banquets",
  "/facilities/dining",
  "/facilities/recreation",
  "/facilities/recreation/kids-zone",
  "/facilities/recreation/cards-room",
  "/facilities/recreation/housie",
  "/facilities/sports-shop",
  "/facilities/massage-chairs",
  "/facilities/library",
  "/facilities/medical-cell",
  "/booking",
  "/membership",
  "/membership/affiliated-clubs",
  "/achievements",
  "/partners",
  "/partners/team-spirit",
  "/partners/annual-report",
  "/downloads",
  "/legal",
  "/legal/cancellation",
];

const BANQUET_HALL_SLUGS = ["regal", "rhythm", "glamourra"];

// Matches VENUE_SLUGS_FALLBACK in facilities/dining/[venue]/page.tsx — these
// routes render (with PENDING_CONTENT placeholders) even before diningVenue
// documents exist in Sanity, so the sitemap lists them unconditionally too.
const DINING_VENUE_SLUGS = [
  "golden-peacock",
  "water-front-cafe",
  "bleu-restobar",
  "flavours",
  "cookie-dough-cafe",
  "food-court",
];

const MEMBERSHIP_TYPE_SLUGS = [
  "life",
  "corporate",
  "ward",
  "service",
  "yearly",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sportSlugs, eventSlugs] = await Promise.all([
    client.fetch<string[]>(
      `*[_type == "sport"].slug.current`,
      {},
      { next: { tags: ["sports"] } }
    ),
    client.fetch<string[]>(
      `*[_type == "event"].slug.current`,
      {},
      { next: { tags: ["events"] } }
    ),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const sportEntries: MetadataRoute.Sitemap = sportSlugs.map((slug) => ({
    url: `${SITE_URL}/sports/${slug}`,
  }));

  const eventEntries: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${SITE_URL}/events/${slug}`,
  }));

  const banquetHallEntries: MetadataRoute.Sitemap = BANQUET_HALL_SLUGS.map(
    (slug) => ({
      url: `${SITE_URL}/facilities/banquets/${slug}`,
    })
  );

  const diningVenueEntries: MetadataRoute.Sitemap = DINING_VENUE_SLUGS.map(
    (slug) => ({
      url: `${SITE_URL}/facilities/dining/${slug}`,
    })
  );

  const membershipTypeEntries: MetadataRoute.Sitemap =
    MEMBERSHIP_TYPE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/membership/${slug}`,
    }));

  return [
    ...staticEntries,
    ...sportEntries,
    ...eventEntries,
    ...banquetHallEntries,
    ...diningVenueEntries,
    ...membershipTypeEntries,
  ];
}
