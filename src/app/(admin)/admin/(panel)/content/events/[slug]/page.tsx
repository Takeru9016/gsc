import { notFound } from "next/navigation";
import { EventForm } from "@/components/sections/admin/content/EventForm.tsx";
import { getEventBySlug } from "@/lib/sanity/queries.ts";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{event.title}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit event details.
        </p>
      </div>
      <EventForm event={event} mode="edit" />
    </div>
  );
}
