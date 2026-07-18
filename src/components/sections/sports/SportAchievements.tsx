import Image from "next/image";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { Achievement } from "@/lib/sanity/queries.ts";

interface SportAchievementsProps {
  achievements: Achievement[];
  sportName: string;
  sportSlug: string;
}

export function SportAchievements({
  achievements,
  sportName,
  sportSlug,
}: SportAchievementsProps) {
  return (
    <SectionWrapper className="pt-0">
      <AnimatedText
        as="h2"
        className="mb-8 font-display text-(--color-text-primary) text-3xl md:text-4xl"
      >
        Achievements
      </AnimatedText>
      <StaggerReveal className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {achievements.map((achievement) => (
          <div
            className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md"
            key={achievement._id}
          >
            <div className="relative aspect-square">
              <Image
                alt={achievement.title}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                src={urlFor(achievement.image).width(400).height(400).url()}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 p-4">
              <Badge size="sm" variant="gold">
                {achievement.level}
              </Badge>
              <span className="text-(--color-text-secondary) text-sm">
                {achievement.year}
              </span>
            </div>
          </div>
        ))}
      </StaggerReveal>
      <Button
        className="mt-8"
        href={`/achievements?sport=${sportSlug}`}
        variant="secondary"
      >
        View All {sportName} Achievements
      </Button>
    </SectionWrapper>
  );
}
