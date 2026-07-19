import { notFound } from "next/navigation";
import { DiningVenueEditForm } from "@/components/sections/admin/content/DiningVenueEditForm.tsx";
import { getDiningVenueBySlug } from "@/lib/sanity/queries.ts";

export default async function AdminDiningVenueEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getDiningVenueBySlug(slug);

  if (!venue) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{venue.name}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit venue details, menus, hours, and gallery.
        </p>
      </div>
      <DiningVenueEditForm venue={venue} />
    </div>
  );
}
