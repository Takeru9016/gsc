import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface BanquetHallBookingCTAProps {
  hallName: string;
  hallSlug: string;
}

export function BanquetHallBookingCTA({
  hallName,
  hallSlug,
}: BanquetHallBookingCTAProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <AnimatedText
            as="h2"
            className="font-body font-semibold text-(--color-text-primary) text-2xl"
          >
            Inquire About {hallName}
          </AnimatedText>
          <p className="mt-2 text-(--color-text-secondary)">
            Share your event details and we'll get back to you within 24 hours.
          </p>
        </div>
        <Button
          className="shrink-0"
          href={`/booking?type=banquet&hall=${hallSlug}`}
        >
          Inquire Now
        </Button>
      </div>
    </SectionWrapper>
  );
}
