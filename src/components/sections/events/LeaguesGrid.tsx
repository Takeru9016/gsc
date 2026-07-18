import { Badge } from "@/components/shared/Badge.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import type { League } from "@/lib/sanity/queries.ts";

interface LeaguesGridProps {
  activeSport: string;
  leagues: League[];
}

export function LeaguesGrid({ leagues, activeSport }: LeaguesGridProps) {
  const filtered = activeSport
    ? leagues.filter((league) => league.sport === activeSport)
    : leagues;

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-(--color-text-secondary)">
        No leagues match your filter. Try a different sport.
      </p>
    );
  }

  return (
    <StaggerReveal className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
      {filtered.map((league) => (
        <div
          className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
          key={`${league.sport}-${league.name}`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{league.sport}</Badge>
            <Badge variant="gold">{league.format}</Badge>
            {league.isActive ? (
              <Badge variant="green">Currently Active</Badge>
            ) : null}
          </div>
          <h3 className="font-body font-semibold text-(--color-text-primary) text-2xl">
            {league.name}
          </h3>
          <p className="mt-2 text-(--color-text-secondary) text-sm">
            {league.frequency}
            {league.approximateDates ? ` · ${league.approximateDates}` : ""}
          </p>
          {league.description ? (
            <p className="mt-3 line-clamp-3 text-(--color-text-secondary) text-sm">
              {league.description}
            </p>
          ) : null}
        </div>
      ))}
    </StaggerReveal>
  );
}
