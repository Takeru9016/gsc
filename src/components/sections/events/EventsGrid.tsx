import Link from "next/link";
import { EventCard } from "@/components/shared/EventCard.tsx";
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
        <Link
          className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
          href="/events/leagues"
        >
          View Leagues
        </Link>
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((event) => (
        <EventCard event={event} key={event._id} />
      ))}
    </div>
  );
}
