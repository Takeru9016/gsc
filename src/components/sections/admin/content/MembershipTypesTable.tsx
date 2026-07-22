import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { MembershipTypeListItem } from "@/lib/sanity/queries.ts";

interface MembershipTypesTableProps {
  membershipTypes: MembershipTypeListItem[];
}

export function MembershipTypesTable({
  membershipTypes,
}: MembershipTypesTableProps) {
  if (membershipTypes.length === 0) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
        No membership types found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <table className="w-full text-left text-sm">
        <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Active</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {membershipTypes.map((membershipType) => (
            <tr
              className="border-(--color-border) border-b last:border-0"
              key={membershipType._id}
            >
              <td className="px-4 py-3 align-top">
                <Badge size="sm" variant="outline">
                  {membershipType.type}
                </Badge>
              </td>
              <td className="px-4 py-3 align-top font-medium">
                {membershipType.title}
              </td>
              <td className="px-4 py-3 align-top">
                <Badge
                  size="sm"
                  variant={membershipType.isActive ? "green" : "outline"}
                >
                  {membershipType.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-4 py-3 align-top">{membershipType.order}</td>
              <td className="px-4 py-3 align-top">
                <Button
                  href={`/admin/content/membership-types/${membershipType.type}`}
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
