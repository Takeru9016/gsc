import { notFound } from "next/navigation";
import { LegalPageForm } from "@/components/sections/admin/content/LegalPageForm.tsx";
import { getLegalPage } from "@/lib/sanity/queries.ts";

export default async function AdminLegalPageEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getLegalPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{page.title}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit legal page content.
        </p>
      </div>
      <LegalPageForm page={page} />
    </div>
  );
}
