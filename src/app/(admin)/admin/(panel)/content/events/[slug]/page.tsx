import { AdminPlaceholder } from "@/components/shared/AdminPlaceholder.tsx";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <AdminPlaceholder taskCode="ADMIN-05" title={`Edit Event — ${slug}`} />
  );
}
