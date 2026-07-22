import { MilestonesTable } from "@/components/sections/admin/content/MilestonesTable.tsx";
import { getMilestones } from "@/lib/sanity/queries.ts";

export default async function AdminMilestonesPage() {
  const milestones = await getMilestones();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Milestones</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the club history timeline shown on the About page.
        </p>
      </div>
      <MilestonesTable milestones={milestones} />
    </div>
  );
}
