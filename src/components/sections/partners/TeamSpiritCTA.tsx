import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function TeamSpiritCTA() {
  return (
    <SectionWrapper>
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <AnimatedText
            as="h2"
            className="font-body font-semibold text-(--color-text-primary) text-2xl"
          >
            Advertise in Team Spirit
          </AnimatedText>
          <p className="mt-2 text-(--color-text-secondary)">
            GSC's member magazine — 3 editions per year. Summer, Diwali, and New
            Year. Reach members directly in their homes.
          </p>
        </div>
        <Button
          className="shrink-0"
          href="/partners/team-spirit"
          variant="secondary"
        >
          View Team Spirit
        </Button>
      </div>
    </SectionWrapper>
  );
}
