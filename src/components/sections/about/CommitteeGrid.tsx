import Image from "next/image";
import { Badge } from "@/components/shared/Badge.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { CommitteeMember } from "@/lib/sanity/queries.ts";

const ROLE_LABELS: Record<string, string> = {
  founderMember: "Founder Member",
  governingCouncil: "Governing Council",
  officeBearer: "Office Bearer",
  promoterMember: "Promoter Member",
};

const SKELETON_IDS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
];

interface CommitteeGridProps {
  activeRole: string;
  members: CommitteeMember[];
}

export function CommitteeGrid({ members, activeRole }: CommitteeGridProps) {
  if (members.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKELETON_IDS.map((id) => (
          <div
            className="animate-pulse rounded-2xl border border-(--color-border) bg-(--color-surface) p-6"
            key={id}
          >
            <div className="aspect-square rounded-2xl bg-(--color-border)" />
            <div className="mt-4 h-5 w-2/3 rounded bg-(--color-border)" />
            <div className="mt-2 h-4 w-1/2 rounded bg-(--color-border)" />
          </div>
        ))}
      </div>
    );
  }

  const filtered = activeRole
    ? members.filter((member) => member.role === activeRole)
    : members;

  if (filtered.length === 0) {
    return (
      <p className="text-center text-(--color-text-secondary)">
        No members in this category yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((member) => (
        <div
          className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6"
          key={member._id}
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-dark">
            {member.photo ? (
              <Image
                alt={member.name}
                className="object-cover"
                fill
                src={urlFor(member.photo).width(400).height(400).url()}
              />
            ) : null}
          </div>
          <h3 className="mt-4 font-body font-semibold text-(--color-text-primary) text-xl">
            {member.name}
          </h3>
          <p className="mt-1 text-(--color-text-secondary)">
            {member.designation}
          </p>
          <Badge className="mt-3" variant="primary">
            {ROLE_LABELS[member.role] ?? member.role}
          </Badge>
        </div>
      ))}
    </div>
  );
}
