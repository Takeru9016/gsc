import type { Metadata } from "next";
import { ContactInfoPanel } from "@/components/sections/contact/ContactInfoPanel.tsx";
import { ContactForm } from "@/components/shared/forms/ContactForm.tsx";
import { PageHero } from "@/components/shared/PageHero.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { getSiteConfig } from "@/lib/sanity/queries.ts";

export function generateMetadata(): Metadata {
  return {
    description: "We're here to help.",
    title: "Contact | Goregaon Sports Club",
  };
}

export default async function ContactPage() {
  const siteConfig = await getSiteConfig();

  return (
    <>
      <PageHero headline="Get In Touch" subline="We're here to help." />
      <SectionWrapper>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <ContactForm />
          <ContactInfoPanel siteConfig={siteConfig} />
        </div>
      </SectionWrapper>
      <SectionWrapper className="pt-0">
        <div className="rounded-2xl border border-accent-red/20 bg-accent-red/10 px-6 py-4 text-center">
          <p className="text-accent-red text-sm">
            Medical Cell: {siteConfig.emergencyPhone} | Emergency:{" "}
            {siteConfig.emergencyPhone2}
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
