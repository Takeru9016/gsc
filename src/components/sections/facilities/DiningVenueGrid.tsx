import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getDiningVenueTypeMeta } from "@/lib/diningVenueType.ts";
import { urlFor } from "@/lib/sanity/image.ts";
import type { DiningVenueListItem } from "@/lib/sanity/queries.ts";

interface DiningVenueGridProps {
  venues: DiningVenueListItem[];
}

// Sanity may not have diningVenue documents seeded yet — these 6 venues
// always exist per GSC.md, so the hub never renders an empty grid.
const VENUES_FALLBACK: DiningVenueListItem[] = [
  {
    _id: "golden-peacock",
    ageRestriction: null,
    cuisineType: null,
    hasBar: false,
    heroImage: null,
    name: "Golden Peacock",
    slug: "golden-peacock",
    tagline: null,
    type: "Veg",
  },
  {
    _id: "water-front-cafe",
    ageRestriction: null,
    cuisineType: null,
    hasBar: false,
    heroImage: null,
    name: "Water Front Cafe",
    slug: "water-front-cafe",
    tagline: null,
    type: "Veg",
  },
  {
    _id: "bleu-restobar",
    ageRestriction: 25,
    cuisineType: null,
    hasBar: true,
    heroImage: null,
    name: "Bleu Restobar",
    slug: "bleu-restobar",
    tagline: null,
    type: "NonVeg",
  },
  {
    _id: "flavours",
    ageRestriction: null,
    cuisineType: null,
    hasBar: false,
    heroImage: null,
    name: "Flavours",
    slug: "flavours",
    tagline: null,
    type: "Veg",
  },
  {
    _id: "cookie-dough-cafe",
    ageRestriction: null,
    cuisineType: null,
    hasBar: false,
    heroImage: null,
    name: "Cookie Dough Cafe",
    slug: "cookie-dough-cafe",
    tagline: null,
    type: "Veg",
  },
  {
    _id: "food-court",
    ageRestriction: null,
    cuisineType: null,
    hasBar: false,
    heroImage: null,
    name: "Food Court",
    slug: "food-court",
    tagline: null,
    type: "Mixed",
  },
];

function VenueCard({ venue }: { venue: DiningVenueListItem }) {
  const typeMeta = getDiningVenueTypeMeta(venue.type);

  return (
    <Link
      className="group block overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
      href={`/facilities/dining/${venue.slug}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-dark">
        {venue.heroImage ? (
          <Image
            alt={venue.name}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            fill
            src={urlFor(venue.heroImage).width(600).height(340).url()}
          />
        ) : (
          // [PENDING_CONTENT] — venue hero image from Sanity
          <div className="absolute inset-0 bg-surface-dark" />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
          {venue.name}
        </h3>
        <Badge className="shrink-0" size="sm" variant={typeMeta.variant}>
          {typeMeta.label}
        </Badge>
      </div>
      <p className="mt-2 text-(--color-text-secondary) text-sm">
        {venue.tagline ?? "[PENDING_CONTENT] — venue tagline"}
      </p>
      {venue.hasBar ? (
        <Badge className="mt-3" size="sm" variant="red">
          {venue.ageRestriction ?? 25}+ | Bar Available
        </Badge>
      ) : null}
      <span className="mt-4 flex items-center gap-1 font-medium text-primary text-sm">
        View Menu &amp; Hours
        <ArrowRight
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
          size={16}
        />
      </span>
    </Link>
  );
}

export function DiningVenueGrid({ venues }: DiningVenueGridProps) {
  const displayVenues = venues.length > 0 ? venues : VENUES_FALLBACK;

  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {displayVenues.map((venue) => (
          <VenueCard key={venue.slug} venue={venue} />
        ))}
      </div>
      <p className="mt-8 text-center text-(--color-text-secondary) text-sm">
        All restaurants except Bleu Restobar are 100% vegetarian.
      </p>
    </SectionWrapper>
  );
}
