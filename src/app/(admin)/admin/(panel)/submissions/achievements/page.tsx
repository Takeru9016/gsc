import { AchievementsTable } from "@/components/sections/admin/submissions/AchievementsTable.tsx";
import { getAllAchievementSubmissions } from "@/lib/db/adminQueries.ts";

export default async function AdminAchievementSubmissionsPage() {
  const submissions = await getAllAchievementSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">
          Achievement Submissions
        </h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Member-submitted achievements awaiting review. Approving publishes to
          Sanity.
        </p>
      </div>
      <AchievementsTable submissions={submissions} />
    </div>
  );
}
