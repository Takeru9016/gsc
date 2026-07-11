import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { PDFViewerLazy } from "@/components/shared/PDFViewerLazy.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

// [PENDING_CONTENT] — Cloudinary-hosted bye-laws PDF URL from manager
const BYE_LAWS_PDF_URL: string | null = null;

export function generateMetadata(): Metadata {
  return {
    description: "Official rules and governance of Goregaon Sports Club.",
    title: "Bye-Laws | About | Goregaon Sports Club",
  };
}

export default function ByeLawsPage() {
  return (
    <>
      <PageHero
        headline="Club Bye-Laws"
        subline="Official rules and governance of Goregaon Sports Club."
      />
      <SectionWrapper>
        {BYE_LAWS_PDF_URL ? (
          <PDFViewerLazy title="Club Bye-Laws" url={BYE_LAWS_PDF_URL} />
        ) : (
          <div className="flex aspect-3/4 max-h-[80vh] items-center justify-center rounded-2xl border border-(--color-border) bg-surface-dark">
            <p className="text-text-secondary-dark">
              PDF will be available here.
            </p>
          </div>
        )}
      </SectionWrapper>
      <SectionWrapper className="pt-0">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <AnimatedText
              as="h2"
              className="font-body font-semibold text-(--color-text-primary) text-2xl"
            >
              Questions about club rules?
            </AnimatedText>
            <p className="mt-2 text-(--color-text-secondary)">
              Reach out to us and we'll help clarify anything about club
              governance.
            </p>
          </div>
          <Link
            className="inline-flex min-w-[120px] shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
            href="/contact"
          >
            Contact Us
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
}
