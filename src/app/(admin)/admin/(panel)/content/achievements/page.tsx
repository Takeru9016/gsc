import { AchievementsGrid } from "@/components/sections/admin/content/AchievementsGrid.tsx";
import { AchievementsTable } from "@/components/sections/admin/submissions/AchievementsTable.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { getAllAchievementSubmissions } from "@/lib/db/adminQueries.ts";
import { getAchievements } from "@/lib/sanity/queries.ts";

export default async function AdminAchievementsContentPage() {
  const [achievements, submissions] = await Promise.all([
    getAchievements(),
    getAllAchievementSubmissions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Achievements</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the published achievement wall and review member submissions.
        </p>
      </div>

      <Tabs defaultValue="approved">
        <TabsList>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="approved">
          <AchievementsGrid achievements={achievements} />
        </TabsContent>
        <TabsContent value="pending">
          <AchievementsTable submissions={submissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
