import { Button } from "@/components/shared/Button.tsx";
import { EventCard } from "@/components/shared/EventCard.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";
import type { EventListItem } from "@/lib/sanity/queries.ts";

interface EventsGridProps {
  activeStatus: string;
  activeType: string;
  events: EventListItem[];
}

export function EventsGrid({
  events,
  activeStatus,
  activeType,
}: EventsGridProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
        <p className="text-(--color-text-secondary)">
          No events currently. Check back soon.
        </p>
        <Button href="/events/leagues">View Leagues</Button>
      </div>
    );
  }

  const filtered = events.filter((event) => {
    const matchesStatus = activeStatus ? event.status === activeStatus : true;
    const matchesType = activeType ? event.type === activeType : true;
    return matchesStatus && matchesType;
  });

  if (filtered.length === 0) {
    return (
      <p className="py-12 text-center text-(--color-text-secondary)">
        No events match your filters. Try a different combination.
      </p>
    );
  }

  return (
    <StaggerReveal className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((event) => (
        <EventCard event={event} key={event._id} />
      ))}
    </StaggerReveal>
  );
}
