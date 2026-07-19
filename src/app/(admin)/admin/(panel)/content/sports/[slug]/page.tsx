import { notFound } from "next/navigation";
import { SportEditForm } from "@/components/sections/admin/content/SportEditForm.tsx";
import { getSportBySlug } from "@/lib/sanity/queries.ts";

export default async function AdminSportEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sport = await getSportBySlug(slug);

  if (!sport) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{sport.name}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit sport details, schedule, and coaching information.
        </p>
      </div>
      <SportEditForm sport={sport} />
    </div>
  );
}
