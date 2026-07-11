import type { Metadata } from "next";
import Link from "next/link";
import { DownloadsFilterBar } from "@/components/sections/downloads/DownloadsFilterBar.tsx";
import { DownloadsList } from "@/components/sections/downloads/DownloadsList.tsx";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getDownloads } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "Official club documents and notices.",
    title: "Downloads & Notices | Goregaon Sports Club",
  };
}

interface DownloadsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function DownloadsPage({
  searchParams,
}: DownloadsPageProps) {
  const [downloads, resolvedSearchParams] = await Promise.all([
    getDownloads(),
    searchParams,
  ]);

  return (
    <>
      <PageHero
        headline="Downloads & Notices"
        subline="Official club documents and notices."
      />
      <SectionWrapper>
        <div className="mb-8 md:mb-12 lg:mb-16">
          <DownloadsFilterBar />
        </div>
        <DownloadsList
          activeCategory={resolvedSearchParams.category ?? ""}
          downloads={downloads}
        />
      </SectionWrapper>
      <SectionWrapper className="pt-0">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <AnimatedText
              as="h2"
              className="font-body font-semibold text-(--color-text-primary) text-2xl"
            >
              Want to receive club notices directly?
            </AnimatedText>
            <p className="mt-2 text-(--color-text-secondary)">
              Contact the club office.
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
