import type { Metadata } from "next";
import { BookingForm } from "@/components/shared/forms/BookingForm.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getSiteConfig } from "@/lib/sanity/queries.ts";
import type { BookingFormValues } from "@/lib/validations.ts";

export function generateMetadata(): Metadata {
  return {
    description: "Room, banquet, ground, or coaching — one form.",
    title: "Book a Facility | Goregaon Sports Club",
  };
}

interface BookingPageProps {
  searchParams: Promise<{ hall?: string; sport?: string; type?: string }>;
}

const VALID_TYPES: BookingFormValues["bookingType"][] = [
  "room",
  "banquet",
  "ground",
  "coaching",
];

function resolveType(
  value?: string
): BookingFormValues["bookingType"] | undefined {
  return VALID_TYPES.find((type) => type === value);
}

function isPendingContent(value: string): boolean {
  return value === "[PENDING_CONTENT]";
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const [siteConfig, resolvedSearchParams] = await Promise.all([
    getSiteConfig(),
    searchParams,
  ]);

  return (
    <>
      <PageHero
        headline="Book a Facility"
        subline="Room, banquet, ground, or coaching — one form."
      />
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <BookingForm
              defaultHall={resolvedSearchParams.hall}
              defaultSport={resolvedSearchParams.sport}
              defaultType={resolveType(resolvedSearchParams.type)}
            />
          </div>
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
            <h3 className="font-body font-semibold text-(--color-text-primary) text-lg">
              Prefer to call?
            </h3>
            <p className="mt-4 text-(--color-text-secondary)">
              {isPendingContent(siteConfig.phone) ? (
                siteConfig.phone
              ) : (
                <a
                  className="transition-colors duration-200 hover:text-primary"
                  href={`tel:${siteConfig.phone}`}
                >
                  {siteConfig.phone}
                </a>
              )}
            </p>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
