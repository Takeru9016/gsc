"use client";

import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useCallback, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/shared/Button.tsx";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  maxHeight?: string;
  showDownload?: boolean;
  title?: string;
  url: string;
}

export function PDFViewer({
  url,
  title,
  showDownload = true,
  maxHeight = "80vh",
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasError, setHasError] = useState(false);

  const handleLoadError = useCallback(() => setHasError(true), []);

  const handleLoadSuccess = useCallback(
    ({ numPages: loadedPages }: { numPages: number }) => {
      setNumPages(loadedPages);
      setPageNumber(1);
    },
    []
  );

  const goToPreviousPage = useCallback(() => {
    setPageNumber((page) => Math.max(1, page - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber((page) => (numPages ? Math.min(numPages, page + 1) : page));
  }, [numPages]);

  if (hasError) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center">
        <p className="text-(--color-text-secondary)">
          Could not load document. Download instead.
        </p>
        <Button className="mt-4" external href={url}>
          Download PDF
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {title ? (
          <h3 className="font-body font-semibold text-(--color-text-primary) text-lg">
            {title}
          </h3>
        ) : (
          <span />
        )}
        {showDownload ? (
          <Button external href={url} size="sm" variant="secondary">
            <Download aria-hidden="true" className="size-4" />
            Download
          </Button>
        ) : null}
      </div>

      <div
        className="flex justify-center overflow-auto rounded-xl bg-surface-dark"
        style={{ maxHeight }}
      >
        <Document
          file={url}
          loading={
            <div className="flex aspect-3/4 w-full max-w-md items-center justify-center p-8">
              <div className="h-full w-full animate-pulse rounded-lg bg-elevated-dark" />
            </div>
          }
          onLoadError={handleLoadError}
          onLoadSuccess={handleLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>

      {numPages && numPages > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            aria-label="Previous page"
            className="rounded-full border border-(--color-border) p-2 text-(--color-text-primary) transition-all duration-200 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            disabled={pageNumber <= 1}
            onClick={goToPreviousPage}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <span className="text-(--color-text-secondary) text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <button
            aria-label="Next page"
            className="rounded-full border border-(--color-border) p-2 text-(--color-text-primary) transition-all duration-200 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
            disabled={pageNumber >= numPages}
            onClick={goToNextPage}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
