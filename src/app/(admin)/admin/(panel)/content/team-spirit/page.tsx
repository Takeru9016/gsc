import { TeamSpiritTable } from "@/components/sections/admin/content/TeamSpiritTable.tsx";
import { getTeamSpiritEditionsAdmin } from "@/lib/sanity/queries.ts";

export default async function AdminTeamSpiritPage() {
  const editions = await getTeamSpiritEditionsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Team Spirit</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the 3 Team Spirit magazine editions published each year.
        </p>
      </div>
      <TeamSpiritTable editions={editions} />
    </div>
  );
}
