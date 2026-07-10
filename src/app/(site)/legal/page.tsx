import type { Metadata } from "next";
import { LegalPolicySection } from "@/components/sections/legal/LegalPolicySection.tsx";
import { PolicyLinksSection } from "@/components/sections/legal/PolicyLinksSection.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { getLegalPage } from "@/lib/sanity/queries.ts";

// [DPDP_REVIEW_REQUIRED] — Privacy Policy and Terms of Use content must be
// reviewed for Indian DPDP Act 2023 compliance before launch.

export async function generateMetadata(): Promise<Metadata> {
  const privacyPolicy = await getLegalPage("privacy-policy");

  return {
    description:
      privacyPolicy?.metaDescription ??
      "Privacy policy, terms of use, and cancellation policy for Goregaon Sports Club.",
    title:
      privacyPolicy?.metaTitle ?? "Legal & Policies | Goregaon Sports Club",
  };
}

export default async function LegalPage() {
  const [privacyPolicy, termsOfUse] = await Promise.all([
    getLegalPage("privacy-policy"),
    getLegalPage("terms-of-use"),
  ]);

  return (
    <>
      <PageHero headline="Legal & Policies" />
      <PolicyLinksSection />
      <LegalPolicySection
        fallbackTitle="Privacy Policy"
        id="privacy"
        legalPage={privacyPolicy}
      />
      <LegalPolicySection
        fallbackTitle="Terms of Use"
        id="terms"
        legalPage={termsOfUse}
      />
    </>
  );
}
