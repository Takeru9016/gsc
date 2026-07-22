import { TeamSpiritForm } from "@/components/sections/admin/content/TeamSpiritForm.tsx";

export default function AdminTeamSpiritCreatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-semibold text-3xl">Add Edition</h1>
        <p className="mt-1 text-(--color-text-secondary) text-sm">
          Publish a new Summer, Diwali, or New Year Team Spirit edition.
        </p>
      </div>
      <TeamSpiritForm mode="create" />
    </div>
  );
}
