"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { DisplayAchievement } from "@/components/shared/AchievementCard.tsx";
import { AchievementCard } from "@/components/shared/AchievementCard.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { urlFor } from "@/lib/sanity/image.ts";

interface AchievementsGridProps {
  achievements: DisplayAchievement[];
  activeLevel: string;
  activeSport: string;
  activeType: string;
  activeYear: string;
}

export function AchievementsGrid({
  achievements,
  activeSport,
  activeLevel,
  activeType,
  activeYear,
}: AchievementsGridProps) {
  const [selected, setSelected] = useState<DisplayAchievement | null>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelected(null);
    }
  }, []);

  const filtered = achievements.filter((achievement) => {
    const matchesSport = activeSport ? achievement.sport === activeSport : true;
    const matchesLevel = activeLevel ? achievement.level === activeLevel : true;
    const matchesType = activeType ? achievement.type === activeType : true;
    const matchesYear = activeYear
      ? achievement.year === Number(activeYear)
      : true;
    return matchesSport && matchesLevel && matchesType && matchesYear;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
        <p className="text-(--color-text-secondary)">
          No achievements found matching your filters.
        </p>
        <Link
          className="font-medium text-primary hover:text-primary-hover"
          href="/achievements"
        >
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
        {filtered.map((achievement) => (
          <AchievementCard
            achievement={achievement}
            key={achievement._id}
            onOpenLightbox={setSelected}
          />
        ))}
      </div>

      <Dialog onOpenChange={handleOpenChange} open={selected !== null}>
        <DialogContent className="max-w-2xl p-0">
          {selected ? (
            <div className="flex flex-col">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-surface-dark">
                {selected.image ? (
                  <Image
                    alt={selected.title}
                    className="object-cover"
                    fill
                    src={urlFor(selected.image).width(1200).height(675).url()}
                  />
                ) : null}
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle>{selected.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="primary">{selected.sport}</Badge>
                  <Badge variant="gold">{selected.level}</Badge>
                  <Badge variant="outline">{selected.type}</Badge>
                  <Badge variant="outline">{selected.year}</Badge>
                </div>
                {selected.memberName ? (
                  <p className="mt-4 font-medium text-(--color-text-primary)">
                    {selected.memberName}
                  </p>
                ) : null}
                {selected.description ? (
                  <p className="mt-2 text-(--color-text-secondary) text-sm">
                    {selected.description}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
