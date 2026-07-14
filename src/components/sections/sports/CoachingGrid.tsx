import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { CoachingSport } from "@/lib/sanity/queries.ts";
import { getSportCategoryLabel } from "@/lib/sportCategories.ts";

interface CoachingGridProps {
  activeCategory: string;
  sports: CoachingSport[];
}

export function CoachingGrid({ sports, activeCategory }: CoachingGridProps) {
  const filtered = activeCategory
    ? sports.filter((sport) => sport.category === activeCategory)
    : sports;

  if (filtered.length === 0) {
    return (
      <p className="text-center text-(--color-text-secondary)">
        No coaching programs in this category yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((sport) => (
        <div
          className="flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
          key={sport._id}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
              {sport.name}
            </h3>
            <Badge className="shrink-0" size="sm" variant="outline">
              {getSportCategoryLabel(sport.category)}
            </Badge>
          </div>
          <p className="text-(--color-text-primary)">
            {sport.coachName
              ? `Coach: ${sport.coachName}`
              : "Contact for coach details"}
          </p>
          <p className="text-(--color-text-secondary) text-sm">
            {sport.coachingSchedule ?? "[PENDING_CONTENT] — Coaching schedule."}
          </p>
          {sport.coachingLevel ? (
            <Badge className="self-start" variant="gold">
              {sport.coachingLevel}
            </Badge>
          ) : null}
          {sport.externalRegistrationUrl ? (
            <Button
              className="self-start"
              external
              href={sport.externalRegistrationUrl}
            >
              Register
            </Button>
          ) : (
            <Button className="self-start" href="/contact?subject=coaching">
              Inquire
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
