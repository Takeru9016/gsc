"use client";

import { useCallback, useState } from "react";
import {
  type SubmissionColumn,
  SubmissionsTableShell,
} from "@/components/sections/admin/submissions/SubmissionsTableShell.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { PartnerInquiry } from "@/lib/db/schema.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

const STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Negotiating", value: "negotiating" },
  { label: "Active", value: "active" },
  { label: "Declined", value: "declined" },
];

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPartnerId(row: PartnerInquiry) {
  return row.id;
}

function getPartnerStatus(row: PartnerInquiry) {
  return row.status;
}

interface PartnerRowActionsProps {
  onUpdateStatus: (id: string, status: PartnerInquiry["status"]) => void;
  pendingId: string | null;
  row: PartnerInquiry;
}

function PartnerRowActions({
  onUpdateStatus,
  pendingId,
  row,
}: PartnerRowActionsProps) {
  const { id } = row;
  const isPending = pendingId === id;

  const handleReviewing = useCallback(() => {
    onUpdateStatus(id, "reviewing");
  }, [onUpdateStatus, id]);

  const handleNegotiating = useCallback(() => {
    onUpdateStatus(id, "negotiating");
  }, [onUpdateStatus, id]);

  const handleActive = useCallback(() => {
    onUpdateStatus(id, "active");
  }, [onUpdateStatus, id]);

  const handleDeclined = useCallback(() => {
    onUpdateStatus(id, "declined");
  }, [onUpdateStatus, id]);

  return (
    <>
      <Button
        disabled={isPending}
        onClick={handleReviewing}
        size="sm"
        variant="secondary"
      >
        Mark Reviewing
      </Button>
      <Button
        disabled={isPending}
        onClick={handleNegotiating}
        size="sm"
        variant="secondary"
      >
        Negotiating
      </Button>
      <Button
        disabled={isPending}
        onClick={handleActive}
        size="sm"
        variant="primary"
      >
        Active
      </Button>
      <Button
        disabled={isPending}
        onClick={handleDeclined}
        size="sm"
        variant="secondary"
      >
        Declined
      </Button>
    </>
  );
}

interface PartnersTableProps {
  partners: PartnerInquiry[];
}

export function PartnersTable({ partners }: PartnersTableProps) {
  const [rows, setRows] = useState(partners);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: PartnerInquiry["status"]) => {
      setPendingId(id);
      try {
        const response = await fetch(
          `/api/admin/submissions/partners/${id}/status`,
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

  const columns: SubmissionColumn<PartnerInquiry>[] = [
    { header: "Company", key: "companyName", render: (row) => row.companyName },
    { header: "Contact", key: "contactName", render: (row) => row.contactName },
    {
      header: "Partnership Type",
      key: "partnershipType",
      render: (row) => row.partnershipType ?? "—",
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
    (row: PartnerInquiry) => (
      <PartnerRowActions
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
      emptyLabel="No partner inquiries match this filter."
      getId={getPartnerId}
      getStatus={getPartnerStatus}
      renderActions={renderActions}
      rows={rows}
      statusFilters={STATUS_FILTERS}
    />
  );
}
