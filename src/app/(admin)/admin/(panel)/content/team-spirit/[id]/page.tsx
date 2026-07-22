import { notFound } from "next/navigation";
import { TeamSpiritForm } from "@/components/sections/admin/content/TeamSpiritForm.tsx";
import { getTeamSpiritEditionById } from "@/lib/sanity/queries.ts";

export default async function AdminTeamSpiritEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edition = await getTeamSpiritEditionById(id);

  if (!edition) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          {edition.editionName}
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit Team Spirit edition details.
        </p>
      </div>
      <TeamSpiritForm edition={edition} mode="edit" />
    </div>
  );
}
