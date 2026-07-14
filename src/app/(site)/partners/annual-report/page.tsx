import type { Metadata } from "next";
import { AnnualReportsList } from "@/components/sections/partners/AnnualReportsList.tsx";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getAnnualReports } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description:
      "Transparency and accountability — GSC's published annual reports.",
    title: "Annual Reports | Partners | Goregaon Sports Club",
  };
}

export default async function AnnualReportPage() {
  const reports = await getAnnualReports();

  return (
    <>
      <PageHero
        headline="Annual Reports"
        subline="Transparency and accountability."
      />
      <AnnualReportsList reports={reports} />
      <SectionWrapper className="pt-0">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <AnimatedText
              as="h2"
              className="font-body font-semibold text-(--color-text-primary) text-2xl"
            >
              Looking for older reports?
            </AnimatedText>
            <p className="mt-2 text-(--color-text-secondary)">
              For older reports or additional documents, contact the club
              office.
            </p>
          </div>
          <Button className="shrink-0" href="/contact">
            Contact Us
          </Button>
        </div>
      </SectionWrapper>
    </>
  );
}
