"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import {
  type SubmissionColumn,
  SubmissionsTableShell,
} from "@/components/sections/admin/submissions/SubmissionsTableShell.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { AchievementSubmission } from "@/lib/db/schema.ts";
import { getStatusBadgeVariant } from "@/lib/utils.ts";

const STATUS_FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function getAchievementId(row: AchievementSubmission) {
  return row.id;
}

function getAchievementStatus(row: AchievementSubmission) {
  return row.status;
}

interface PhotoCellProps {
  onView: (imageUrl: string) => void;
  row: AchievementSubmission;
}

function PhotoCell({ onView, row }: PhotoCellProps) {
  const { imageUrl, achievementTitle } = row;

  const handleClick = useCallback(() => {
    if (imageUrl) {
      onView(imageUrl);
    }
  }, [imageUrl, onView]);

  if (!imageUrl) {
    return (
      <span className="text-(--color-text-secondary) text-xs">No photo</span>
    );
  }

  return (
    <button
      className="relative block size-12 overflow-hidden rounded-lg border border-(--color-border)"
      onClick={handleClick}
      type="button"
    >
      <Image
        alt={achievementTitle}
        className="object-cover"
        fill
        src={imageUrl}
      />
    </button>
  );
}

interface AchievementRowActionsProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewPhoto: (imageUrl: string) => void;
  pendingId: string | null;
  row: AchievementSubmission;
}

function AchievementRowActions({
  onApprove,
  onReject,
  onViewPhoto,
  pendingId,
  row,
}: AchievementRowActionsProps) {
  const { id, imageUrl, status } = row;
  const isPending = pendingId === id;

  const handleApprove = useCallback(() => {
    onApprove(id);
  }, [onApprove, id]);

  const handleReject = useCallback(() => {
    onReject(id);
  }, [onReject, id]);

  const handleViewPhoto = useCallback(() => {
    if (imageUrl) {
      onViewPhoto(imageUrl);
    }
  }, [imageUrl, onViewPhoto]);

  return (
    <>
      <Button
        disabled={isPending || status === "approved"}
        loading={isPending}
        onClick={handleApprove}
        size="sm"
        variant="primary"
      >
        Approve
      </Button>
      <Button
        disabled={isPending || status === "rejected"}
        onClick={handleReject}
        size="sm"
        variant="secondary"
      >
        Reject
      </Button>
      {imageUrl ? (
        <Button onClick={handleViewPhoto} size="sm" variant="secondary">
          View Photo
        </Button>
      ) : null}
    </>
  );
}

interface AchievementsTableProps {
  submissions: AchievementSubmission[];
}

export function AchievementsTable({ submissions }: AchievementsTableProps) {
  const [rows, setRows] = useState(submissions);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const reject = useCallback(async (id: string) => {
    setPendingId(id);
    try {
      const response = await fetch(
        `/api/admin/submissions/achievements/${id}/status`,
        {
          body: JSON.stringify({ status: "rejected" }),
          headers: { "Content-Type": "application/json" },
          method: "PATCH",
        }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, status: "rejected" } : row
        )
      );
    } finally {
      setPendingId(null);
    }
  }, []);

  const approve = useCallback(async (id: string) => {
    setPendingId(id);
    try {
      const response = await fetch("/api/admin/achievements/approve", {
        body: JSON.stringify({ submissionId: id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) {
        return;
      }
      setRows((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, status: "approved" } : row
        )
      );
    } finally {
      setPendingId(null);
    }
  }, []);

  const openLightbox = useCallback((imageUrl: string) => {
    setLightboxUrl(imageUrl);
  }, []);

  const handleLightboxOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setLightboxUrl(null);
    }
  }, []);

  const columns: SubmissionColumn<AchievementSubmission>[] = [
    {
      header: "Member Name",
      key: "memberName",
      render: (row) => row.memberName,
    },
    { header: "Sport", key: "sport", render: (row) => row.sport },
    {
      header: "Achievement",
      key: "achievementTitle",
      render: (row) => row.achievementTitle,
    },
    { header: "Level", key: "level", render: (row) => row.level },
    { header: "Year", key: "year", render: (row) => String(row.year) },
    {
      header: "Photo",
      key: "photo",
      render: (row) => <PhotoCell onView={openLightbox} row={row} />,
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
  ];

  const renderActions = useCallback(
    (row: AchievementSubmission) => (
      <AchievementRowActions
        onApprove={approve}
        onReject={reject}
        onViewPhoto={openLightbox}
        pendingId={pendingId}
        row={row}
      />
    ),
    [approve, reject, openLightbox, pendingId]
  );

  return (
    <>
      <SubmissionsTableShell
        columns={columns}
        emptyLabel="No achievement submissions match this filter."
        getId={getAchievementId}
        getStatus={getAchievementStatus}
        renderActions={renderActions}
        rows={rows}
        statusFilters={STATUS_FILTERS}
      />

      <Dialog
        onOpenChange={handleLightboxOpenChange}
        open={Boolean(lightboxUrl)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Achievement Photo</DialogTitle>
          </DialogHeader>
          {lightboxUrl ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
              <Image
                alt="Achievement submission"
                className="object-contain"
                fill
                src={lightboxUrl}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
