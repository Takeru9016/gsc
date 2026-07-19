import { EventForm } from "@/components/sections/admin/content/EventForm.tsx";

export default function AdminEventCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">New Event</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Create a new tournament, league, or club event.
        </p>
      </div>
      <EventForm mode="create" />
    </div>
  );
}
