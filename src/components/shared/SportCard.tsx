import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/shared/Badge.tsx";
import type { SanityImageSource } from "@/lib/sanity/image.ts";
import { urlFor } from "@/lib/sanity/image.ts";
import { getSportCategoryLabel } from "@/lib/sportCategories.ts";
import { cn } from "@/lib/utils.ts";

interface SportCardSport {
  category: string;
  heroImage: SanityImageSource | null;
  name: string;
  shortDescription: string;
  slug: string;
}

interface SportCardProps {
  className?: string;
  sport: SportCardSport;
}

export function SportCard({ sport, className }: SportCardProps) {
  return (
    <Link
      className={cn(
        "group block overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md",
        className
      )}
      href={`/sports/${sport.slug}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-surface-dark">
        {sport.heroImage ? (
          <Image
            alt={sport.name}
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={urlFor(sport.heroImage).width(600).height(340).url()}
          />
        ) : (
          // [PENDING_CONTENT] — sport hero image from Sanity
          <div className="absolute inset-0 bg-surface-dark" />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="font-body font-semibold text-(--color-text-primary) text-xl">
          {sport.name}
        </h3>
        <Badge className="shrink-0" size="sm">
          {getSportCategoryLabel(sport.category)}
        </Badge>
      </div>
      <p className="mt-2 text-(--color-text-secondary) text-sm">
        {sport.shortDescription}
      </p>
    </Link>
  );
}
