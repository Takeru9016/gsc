import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { PartnerForm } from "@/components/shared/forms/PartnerForm.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function PartnerInquirySection() {
  return (
    <SectionWrapper className="bg-(--color-surface)" id="inquiry">
      <div className="mx-auto max-w-2xl">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-3xl md:text-4xl"
        >
          Start a Partnership
        </AnimatedText>
        <p className="mt-2 mb-8 text-(--color-text-secondary)">
          Tell us about your brand and what you're looking for. Our partnerships
          team will follow up within 48 hours.
        </p>
        <PartnerForm />
      </div>
    </SectionWrapper>
  );
}
