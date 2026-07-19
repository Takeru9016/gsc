import { EventsTable } from "@/components/sections/admin/content/EventsTable.tsx";
import { getEvents } from "@/lib/sanity/queries.ts";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Events</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage tournaments, leagues, and club events.
        </p>
      </div>
      <EventsTable events={events} />
    </div>
  );
}
