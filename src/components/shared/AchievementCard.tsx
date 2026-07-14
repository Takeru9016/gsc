"use client";

import Image from "next/image";
import { useCallback } from "react";
import { Badge } from "@/components/shared/Badge.tsx";
import type { SanityImageSource } from "@/lib/sanity/image.ts";
import { urlFor } from "@/lib/sanity/image.ts";
import type { Achievement } from "@/lib/sanity/queries.ts";
import { cn } from "@/lib/utils.ts";

// Placeholder achievements (shown when no approved Sanity data exists yet)
// carry no real image asset, so the image field is nullable here.
export interface DisplayAchievement extends Omit<Achievement, "image"> {
  image: SanityImageSource | null;
}

interface AchievementCardProps {
  achievement: DisplayAchievement;
  className?: string;
  onOpenLightbox: (achievement: DisplayAchievement) => void;
}

export function AchievementCard({
  achievement,
  onOpenLightbox,
  className,
}: AchievementCardProps) {
  const handleClick = useCallback(() => {
    onOpenLightbox(achievement);
  }, [achievement, onOpenLightbox]);

  return (
    <button
      className={cn(
        "group relative block aspect-square w-full overflow-hidden rounded-2xl border border-(--color-border) bg-surface-dark text-left transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      onClick={handleClick}
      type="button"
    >
      {achievement.image ? (
        <Image
          alt={achievement.title}
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          src={urlFor(achievement.image).width(600).height(600).url()}
        />
      ) : (
        // [PENDING_CONTENT] — placeholder achievement, no Sanity image yet
        <div className="absolute inset-0 bg-surface-dark" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/10 to-transparent opacity-80 transition-opacity duration-200 group-hover:opacity-95" />
      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        <Badge variant="primary">{achievement.sport}</Badge>
        <Badge variant="gold">{achievement.level}</Badge>
      </div>
      <div className="absolute right-0 bottom-0 left-0 p-4">
        <p className="font-body font-semibold text-sm text-text-primary-dark leading-snug">
          {achievement.title}
        </p>
        <p className="mt-1 text-text-secondary-dark text-xs">
          {achievement.year}
        </p>
      </div>
    </button>
  );
}
