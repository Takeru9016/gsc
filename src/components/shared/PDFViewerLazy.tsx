"use client";

import dynamic from "next/dynamic";

// react-pdf touches browser-only globals (DOMMatrix) at module load, which
// crashes server prerendering. ssr: false keeps that module out of the
// server bundle entirely — only usable from within a "use client" boundary.
export const PDFViewerLazy = dynamic(
  () => import("./PDFViewer.tsx").then((mod) => mod.PDFViewer),
  {
    loading: () => (
      <div className="flex aspect-3/4 max-h-[80vh] items-center justify-center rounded-2xl border border-(--color-border) bg-surface-dark">
        <p className="text-text-secondary-dark">Loading document…</p>
      </div>
    ),
    ssr: false,
  }
);
