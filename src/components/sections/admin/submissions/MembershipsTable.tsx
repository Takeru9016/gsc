"use client";

import { useCallback, useState } from "react";
import {
  type SubmissionColumn,
  SubmissionsTableShell,
} from "@/components/sections/admin/submissions/SubmissionsTableShell.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { MembershipInquiry } from "@/lib/db/schema.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

const STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Contacted", value: "contacted" },
  { label: "Closed", value: "closed" },
];

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getMembershipId(row: MembershipInquiry) {
  return row.id;
}

function getMembershipStatus(row: MembershipInquiry) {
  return row.status;
}

interface MembershipRowActionsProps {
  onUpdateStatus: (id: string, status: MembershipInquiry["status"]) => void;
  pendingId: string | null;
  row: MembershipInquiry;
}

function MembershipRowActions({
  onUpdateStatus,
  pendingId,
  row,
}: MembershipRowActionsProps) {
  const { id } = row;
  const isPending = pendingId === id;

  const handleReviewed = useCallback(() => {
    onUpdateStatus(id, "reviewed");
  }, [onUpdateStatus, id]);

  const handleContacted = useCallback(() => {
    onUpdateStatus(id, "contacted");
  }, [onUpdateStatus, id]);

  const handleClosed = useCallback(() => {
    onUpdateStatus(id, "closed");
  }, [onUpdateStatus, id]);

  return (
    <>
      <Button
        disabled={isPending}
        onClick={handleReviewed}
        size="sm"
        variant="secondary"
      >
        Mark Reviewed
      </Button>
      <Button
        disabled={isPending}
        onClick={handleContacted}
        size="sm"
        variant="secondary"
      >
        Mark Contacted
      </Button>
      <Button
        disabled={isPending}
        onClick={handleClosed}
        size="sm"
        variant="secondary"
      >
        Close
      </Button>
    </>
  );
}

interface MembershipsTableProps {
  memberships: MembershipInquiry[];
}

export function MembershipsTable({ memberships }: MembershipsTableProps) {
  const [rows, setRows] = useState(memberships);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: MembershipInquiry["status"]) => {
      setPendingId(id);
      try {
        const response = await fetch(
          `/api/admin/submissions/memberships/${id}/status`,
          {
            body: JSON.stringify({ status }),
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
          }
        );
        if (!response.ok) {
          return;
        }
        setRows((prev) =>
          prev.map((row) => (row.id === id ? { ...row, status } : row))
        );
      } finally {
        setPendingId(null);
      }
    },
    []
  );

  const columns: SubmissionColumn<MembershipInquiry>[] = [
    { header: "Name", key: "name", render: (row) => row.name },
    { header: "Email", key: "email", render: (row) => row.email },
    {
      header: "Membership Type",
      key: "membershipType",
      render: (row) => row.membershipType,
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <Badge size="sm" variant={getStatusBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const renderActions = useCallback(
    (row: MembershipInquiry) => (
      <MembershipRowActions
        onUpdateStatus={updateStatus}
        pendingId={pendingId}
        row={row}
      />
    ),
    [updateStatus, pendingId]
  );

  return (
    <SubmissionsTableShell
      columns={columns}
      emptyLabel="No membership inquiries match this filter."
      getId={getMembershipId}
      getStatus={getMembershipStatus}
      renderActions={renderActions}
      rows={rows}
      statusFilters={STATUS_FILTERS}
    />
  );
}
