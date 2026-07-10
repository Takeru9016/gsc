import type { Metadata } from "next";
import Link from "next/link";
import { LegalPolicySection } from "@/components/sections/legal/LegalPolicySection.tsx";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getLegalPage } from "@/lib/sanity/queries.ts";

// [DPDP_REVIEW_REQUIRED] — Cancellation & Refund Policy content must be
// reviewed for Indian DPDP Act 2023 compliance before launch.

export async function generateMetadata(): Promise<Metadata> {
  const cancellationPolicy = await getLegalPage("cancellation");

  return {
    description:
      cancellationPolicy?.metaDescription ??
      "Refund and cancellation terms for Goregaon Sports Club bookings and memberships.",
    title:
      cancellationPolicy?.metaTitle ??
      "Cancellation & Refund Policy | Goregaon Sports Club",
  };
}

export default async function CancellationPage() {
  const cancellationPolicy = await getLegalPage("cancellation");

  return (
    <>
      <PageHero headline="Cancellation & Refund Policy" />
      <LegalPolicySection
        fallbackTitle="Cancellation & Refund Policy"
        legalPage={cancellationPolicy}
        pendingMessage="Policy document being prepared. Contact us for current terms."
      />
      <SectionWrapper className="pt-0">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <AnimatedText
              as="h2"
              className="font-body font-semibold text-(--color-text-primary) text-2xl"
            >
              Questions?
            </AnimatedText>
            <p className="mt-2 text-(--color-text-secondary)">
              Reach out to us for clarification on cancellation or refund terms.
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
