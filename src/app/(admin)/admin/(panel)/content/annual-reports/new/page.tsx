import { AnnualReportForm } from "@/components/sections/admin/content/AnnualReportForm.tsx";

export default function AdminAnnualReportCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Add Report</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Publish a new annual report.
        </p>
      </div>
      <AnnualReportForm mode="create" />
    </div>
  );
}
