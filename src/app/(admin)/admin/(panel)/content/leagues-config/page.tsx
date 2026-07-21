import { LeaguesTable } from "@/components/sections/admin/content/LeaguesTable.tsx";
import { getLeaguesConfig } from "@/lib/sanity/queries.ts";

export default async function AdminLeaguesConfigPage() {
  const config = await getLeaguesConfig();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-semibold text-3xl">Leagues</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit league details and toggle which leagues are running this year.
          All 18 leagues are fixed — no add or delete.
        </p>
      </div>

      <LeaguesTable leagues={config?.leagues ?? []} />
    </div>
  );
}
