import { AnnualReportsTable } from "@/components/sections/admin/content/AnnualReportsTable.tsx";
import { getAnnualReports } from "@/lib/sanity/queries.ts";

export default async function AdminAnnualReportsPage() {
  const reports = await getAnnualReports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Annual Reports</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Manage the annual reports published on /partners/annual-report.
        </p>
      </div>
      <AnnualReportsTable reports={reports} />
    </div>
  );
}
