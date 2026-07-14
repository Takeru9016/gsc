import { ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { BanquetHallListItem } from "@/lib/sanity/queries.ts";

interface BanquetHallGridProps {
  halls: BanquetHallListItem[];
}

// Sanity may not have banquetHall documents seeded yet — these 3 halls
// always exist per GSC.md, so the hub never renders an empty grid.
const HALLS_FALLBACK: BanquetHallListItem[] = [
  {
    _id: "regal",
    capacity: null,
    heroImage: null,
    name: "Regal Hall",
    slug: "regal",
    tagline: null,
  },
  {
    _id: "rhythm",
    capacity: null,
    heroImage: null,
    name: "Rhythm Hall",
    slug: "rhythm",
    tagline: null,
  },
  {
    _id: "glamourra",
    capacity: null,
    heroImage: null,
    name: "Glamourra Hall",
    slug: "glamourra",
    tagline: null,
  },
];

function HallCard({ hall }: { hall: BanquetHallListItem }) {
  return (
    <Link
      className="group block overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
      href={`/facilities/banquets/${hall.slug}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-dark">
        {hall.heroImage ? (
          <Image
            alt={hall.name}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={urlFor(hall.heroImage).width(600).height(340).url()}
          />
        ) : (
          // [PENDING_CONTENT] — hall hero image from Sanity
          <div className="absolute inset-0 bg-surface-dark" />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
          {hall.name}
        </h3>
        <Badge className="shrink-0" size="sm" variant="outline">
          <Users aria-hidden="true" className="mr-1" size={14} />
          {hall.capacity ? `Up to ${hall.capacity}` : "[PENDING_CONTENT]"}
        </Badge>
      </div>
      <p className="mt-2 text-(--color-text-secondary) text-sm">
        {hall.tagline ?? "[PENDING_CONTENT] — hall tagline"}
      </p>
      <span className="mt-4 flex items-center gap-1 font-medium text-primary text-sm">
        Explore
        <ArrowRight
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
          size={16}
        />
      </span>
    </Link>
  );
}

export function BanquetHallGrid({ halls }: BanquetHallGridProps) {
  const displayHalls = halls.length > 0 ? halls : HALLS_FALLBACK;

  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        {displayHalls.map((hall) => (
          <HallCard hall={hall} key={hall.slug} />
        ))}
      </div>
    </SectionWrapper>
  );
}
