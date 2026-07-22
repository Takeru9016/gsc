import { LegalPagesTable } from "@/components/sections/admin/content/LegalPagesTable.tsx";
import { getAllLegalPages } from "@/lib/sanity/queries.ts";

export default async function AdminLegalPagesPage() {
  const pages = await getAllLegalPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Legal Pages</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Privacy Policy, Terms of Use, and Cancellation Policy. Fixed documents
          — no create or delete.
        </p>
      </div>
      <LegalPagesTable pages={pages} />
    </div>
  );
}
