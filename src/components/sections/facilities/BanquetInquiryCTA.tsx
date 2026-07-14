import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function BanquetInquiryCTA() {
  return (
    <SectionWrapper className="pt-0">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <AnimatedText
            as="h2"
            className="font-body font-semibold text-(--color-text-primary) text-2xl"
          >
            Plan Your Event
          </AnimatedText>
          <p className="mt-2 text-(--color-text-secondary)">
            Tell us about your event and we'll help you find the perfect hall.
          </p>
        </div>
        <Button className="shrink-0" href="/booking?type=banquet">
          Plan Your Event
        </Button>
      </div>
    </SectionWrapper>
  );
}
