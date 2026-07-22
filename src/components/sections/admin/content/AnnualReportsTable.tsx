"use client";

import { Check, Minus } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/shared/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { AnnualReport } from "@/lib/sanity/queries.ts";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ReportRowProps {
  onDeleteRequest: (report: AnnualReport) => void;
  report: AnnualReport;
}

function ReportRow({ report, onDeleteRequest }: ReportRowProps) {
  const handleDeleteRequest = useCallback(() => {
    onDeleteRequest(report);
  }, [onDeleteRequest, report]);

  return (
    <tr className="border-(--color-border) border-b last:border-0">
      <td className="px-4 py-3 align-top font-medium">{report.title}</td>
      <td className="px-4 py-3 align-top">{report.year}</td>
      <td className="px-4 py-3 align-top">
        {report.pdfFile ? (
          <Check
            aria-label="PDF uploaded"
            className="size-4 text-accent-green"
          />
        ) : (
          <Minus
            aria-label="No PDF uploaded"
            className="size-4 text-(--color-text-secondary)"
          />
        )}
      </td>
      <td className="px-4 py-3 align-top">
        {formatDate(report.publishedDate)}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          <Button
            href={`/admin/content/annual-reports/${report._id}`}
            size="sm"
            variant="secondary"
          >
            Edit
          </Button>
          <Button onClick={handleDeleteRequest} size="sm" variant="secondary">
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface DeleteConfirmDialogProps {
  onCancel: () => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  report: AnnualReport | null;
}

function DeleteConfirmDialog({
  report,
  onCancel,
  onConfirm,
  onOpenChange,
  pending,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={Boolean(report)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Annual Report</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Are you sure you want to delete{" "}
          <span className="font-medium">{report?.title}</span>? This cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} size="sm" variant="secondary">
            Cancel
          </Button>
          <Button loading={pending} onClick={onConfirm} size="sm">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AnnualReportsTableProps {
  reports: AnnualReport[];
}

export function AnnualReportsTable({ reports }: AnnualReportsTableProps) {
  const [rows, setRows] = useState(reports);
  const [deleteTarget, setDeleteTarget] = useState<AnnualReport | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteRequest = useCallback((report: AnnualReport) => {
    setDeleteTarget(report);
  }, []);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDeleteTarget(null);
    }
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/content/annual-reports/${deleteTarget._id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return;
      }
      setRows((prev) => prev.filter((row) => row._id !== deleteTarget._id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button href="/admin/content/annual-reports/new" size="sm">
          Add Report
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center text-(--color-text-secondary) text-sm">
          No annual reports yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
          <table className="w-full text-left text-sm">
            <thead className="border-(--color-border) border-b text-(--color-text-secondary) text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">PDF Uploaded</th>
                <th className="px-4 py-3 font-medium">Published Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((report) => (
                <ReportRow
                  key={report._id}
                  onDeleteRequest={handleDeleteRequest}
                  report={report}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmDialog
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onOpenChange={handleDeleteOpenChange}
        pending={deleting}
        report={deleteTarget}
      />
    </div>
  );
}
