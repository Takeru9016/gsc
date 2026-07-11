"use client";

import { Download as DownloadIcon } from "lucide-react";
import { Badge } from "@/components/shared/Badge.tsx";
import type { Download } from "@/lib/sanity/queries.ts";

interface DownloadsListProps {
  activeCategory: string;
  downloads: Download[];
}

interface DisplayDownload {
  _id: string;
  category: string;
  file: string | null;
  fileSize: string | null;
  publishedDate: string | null;
  title: string;
}

// [PENDING_CONTENT] — shown until download documents exist in Sanity.
const PLACEHOLDER_DOWNLOADS: DisplayDownload[] = [
  {
    _id: "placeholder-1",
    category: "Notice",
    file: null,
    fileSize: null,
    publishedDate: null,
    title: "Annual General Meeting Notice",
  },
  {
    _id: "placeholder-2",
    category: "Circular",
    file: null,
    fileSize: null,
    publishedDate: null,
    title: "Revised Facility Timings Circular",
  },
  {
    _id: "placeholder-3",
    category: "Form",
    file: null,
    fileSize: null,
    publishedDate: null,
    title: "Guest Nomination Form",
  },
];

const CATEGORY_BADGE_VARIANT: Record<
  string,
  "primary" | "gold" | "green" | "outline"
> = {
  Circular: "gold",
  Form: "green",
  Notice: "primary",
  Report: "outline",
};

function formatPublishedDate(publishedDate: string | null): string | null {
  if (!publishedDate) {
    return null;
  }

  return new Date(publishedDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DownloadButton({
  file,
  title,
}: {
  file: string | null;
  title: string;
}) {
  if (!file) {
    return (
      <span className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-(--color-border) px-6 py-3 font-medium text-(--color-text-secondary) text-sm">
        Coming Soon
      </span>
    );
  }

  return (
    <a
      aria-label={`Download ${title}`}
      className="inline-flex min-w-[120px] items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-sm text-white transition-all duration-200 hover:bg-primary-hover"
      href={file}
      rel="noopener noreferrer"
      target="_blank"
    >
      <DownloadIcon aria-hidden="true" size={16} />
      Download
    </a>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
      <p className="text-(--color-text-secondary)">
        No downloads in this category.
      </p>
    </div>
  );
}

export function DownloadsList({
  downloads,
  activeCategory,
}: DownloadsListProps) {
  const displayDownloads: DisplayDownload[] =
    downloads.length > 0 ? downloads : PLACEHOLDER_DOWNLOADS;

  const filtered = activeCategory
    ? displayDownloads.filter((item) => item.category === activeCategory)
    : displayDownloads;

  if (filtered.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Table — md and up */}
      <div className="hidden overflow-hidden rounded-2xl border border-(--color-border) md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-(--color-border) border-b bg-(--color-surface)">
              <th className="px-6 py-4 font-medium text-(--color-text-secondary) text-sm">
                Title
              </th>
              <th className="px-6 py-4 font-medium text-(--color-text-secondary) text-sm">
                Category
              </th>
              <th className="px-6 py-4 font-medium text-(--color-text-secondary) text-sm">
                Date
              </th>
              <th className="px-6 py-4 font-medium text-(--color-text-secondary) text-sm">
                Size
              </th>
              <th className="px-6 py-4 font-medium text-(--color-text-secondary) text-sm">
                <span className="sr-only">Download</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                className="border-(--color-border) border-b bg-(--color-surface) last:border-b-0"
                key={item._id}
              >
                <td className="px-6 py-4 font-medium text-(--color-text-primary)">
                  {item.title}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={CATEGORY_BADGE_VARIANT[item.category] ?? "outline"}
                  >
                    {item.category}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-(--color-text-secondary) text-sm">
                  {formatPublishedDate(item.publishedDate) ??
                    "[PENDING_CONTENT]"}
                </td>
                <td className="px-6 py-4 text-(--color-text-secondary) text-sm">
                  {item.fileSize ?? "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <DownloadButton file={item.file} title={item.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card list — below md */}
      <div className="flex flex-col gap-4 md:hidden">
        {filtered.map((item) => (
          <div
            className="flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6"
            key={item._id}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-body font-semibold text-(--color-text-primary)">
                {item.title}
              </h3>
              <Badge
                variant={CATEGORY_BADGE_VARIANT[item.category] ?? "outline"}
              >
                {item.category}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-(--color-text-secondary) text-sm">
              <span>
                {formatPublishedDate(item.publishedDate) ?? "[PENDING_CONTENT]"}
              </span>
              {item.fileSize ? <span>{item.fileSize}</span> : null}
            </div>
            <DownloadButton file={item.file} title={item.title} />
          </div>
        ))}
      </div>
    </>
  );
}
