"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { PDFViewerLazy } from "@/components/shared/PDFViewerLazy.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { urlFor } from "@/lib/sanity/image.ts";
import type { AnnualReport } from "@/lib/sanity/queries.ts";

interface AnnualReportsListProps {
  reports: AnnualReport[];
}

interface DisplayReport {
  _id: string;
  coverImage: AnnualReport["coverImage"];
  pdfFile: string | null;
  publishedDate: string | null;
  title: string;
  year: string;
}

// [PENDING_CONTENT] — shown until annualReport documents exist in Sanity.
const PLACEHOLDER_REPORTS: DisplayReport[] = [
  {
    _id: "placeholder-2023-24",
    coverImage: null,
    pdfFile: null,
    publishedDate: null,
    title: "Annual Report 2023-24",
    year: "2023-24",
  },
  {
    _id: "placeholder-2022-23",
    coverImage: null,
    pdfFile: null,
    publishedDate: null,
    title: "Annual Report 2022-23",
    year: "2022-23",
  },
];

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

function ReportCard({ report }: { report: DisplayReport }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const formattedDate = formatPublishedDate(report.publishedDate);
  const togglePreview = useCallback(() => {
    setIsPreviewOpen((open) => !open);
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface-dark md:w-72 md:shrink-0">
          {report.coverImage ? (
            <Image
              alt={report.title}
              className="object-cover"
              fill
              src={urlFor(report.coverImage).width(600).height(338).url()}
            />
          ) : (
            // [PENDING_CONTENT] — report cover image from Sanity
            <div className="absolute inset-0 bg-surface-dark" />
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <span className="font-display text-3xl text-primary tracking-wide">
            {report.year}
          </span>
          <h3 className="mt-1 font-body font-semibold text-(--color-text-primary) text-2xl">
            {report.title}
          </h3>
          <p className="mt-1 text-(--color-text-secondary) text-sm">
            {formattedDate ?? "[PENDING_CONTENT] — publication date"}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {report.pdfFile ? (
              <>
                <Button external href={report.pdfFile}>
                  <Download aria-hidden="true" size={16} />
                  Download PDF
                </Button>
                <Button onClick={togglePreview} variant="secondary">
                  {isPreviewOpen ? "Close Preview" : "Preview"}
                </Button>
              </>
            ) : (
              <span className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-(--color-border) px-6 py-3 font-medium text-(--color-text-secondary)">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>

      {isPreviewOpen && report.pdfFile ? (
        <div className="mt-6">
          <PDFViewerLazy
            showDownload={false}
            title={report.title}
            url={report.pdfFile}
          />
        </div>
      ) : null}
    </div>
  );
}

export function AnnualReportsList({ reports }: AnnualReportsListProps) {
  const displayReports: DisplayReport[] =
    reports.length > 0 ? reports : PLACEHOLDER_REPORTS;

  return (
    <SectionWrapper className="bg-(--color-surface)">
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Reports
        </AnimatedText>
        <p className="mt-3 max-w-2xl text-(--color-text-secondary)">
          Browse and download every published annual report.
        </p>
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        {displayReports.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))}
      </div>
    </SectionWrapper>
  );
}
