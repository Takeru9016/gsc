"use client";

import { useCallback, useState } from "react";
import {
  type SubmissionColumn,
  SubmissionsTableShell,
} from "@/components/sections/admin/submissions/SubmissionsTableShell.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import type { ContactInquiry } from "@/lib/db/schema.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

const STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Reviewed", value: "reviewed" },
  { label: "Responded", value: "responded" },
  { label: "Closed", value: "closed" },
];

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getContactId(row: ContactInquiry) {
  return row.id;
}

function getContactStatus(row: ContactInquiry) {
  return row.status;
}

interface ContactRowActionsProps {
  onUpdateStatus: (id: string, status: ContactInquiry["status"]) => void;
  pendingId: string | null;
  row: ContactInquiry;
}

function ContactRowActions({
  onUpdateStatus,
  pendingId,
  row,
}: ContactRowActionsProps) {
  const { id } = row;
  const isPending = pendingId === id;

  const handleReviewed = useCallback(() => {
    onUpdateStatus(id, "reviewed");
  }, [onUpdateStatus, id]);

  const handleResponded = useCallback(() => {
    onUpdateStatus(id, "responded");
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
        onClick={handleResponded}
        size="sm"
        variant="secondary"
      >
        Mark Responded
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

interface ContactsTableProps {
  contacts: ContactInquiry[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const [rows, setRows] = useState(contacts);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: ContactInquiry["status"]) => {
      setPendingId(id);
      try {
        const response = await fetch(
          `/api/admin/submissions/contacts/${id}/status`,
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

  const columns: SubmissionColumn<ContactInquiry>[] = [
    { header: "Name", key: "name", render: (row) => row.name },
    { header: "Email", key: "email", render: (row) => row.email },
    { header: "Subject", key: "subject", render: (row) => row.subject },
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
    (row: ContactInquiry) => (
      <ContactRowActions
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
      emptyLabel="No contact submissions match this filter."
      getId={getContactId}
      getStatus={getContactStatus}
      renderActions={renderActions}
      rows={rows}
      statusFilters={STATUS_FILTERS}
    />
  );
}
