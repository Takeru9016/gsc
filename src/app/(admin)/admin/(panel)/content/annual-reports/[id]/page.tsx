import { notFound } from "next/navigation";
import { AnnualReportForm } from "@/components/sections/admin/content/AnnualReportForm.tsx";
import { getAnnualReportById } from "@/lib/sanity/queries.ts";

export default async function AdminAnnualReportEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getAnnualReportById(id);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{report.title}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit annual report details.
        </p>
      </div>
      <AnnualReportForm mode="edit" report={report} />
    </div>
  );
}
