import { notFound } from "next/navigation";
import { BanquetHallEditForm } from "@/components/sections/admin/content/BanquetHallEditForm.tsx";
import { getBanquetHallBySlug } from "@/lib/sanity/queries.ts";

export default async function AdminBanquetHallEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hall = await getBanquetHallBySlug(slug);

  if (!hall) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">{hall.name}</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Edit hall details, setup options, and gallery.
        </p>
      </div>
      <BanquetHallEditForm hall={hall} />
    </div>
  );
}
