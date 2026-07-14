import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function EventsLeaguesCTA() {
  return (
    <SectionWrapper>
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <AnimatedText
            as="h2"
            className="font-display text-(--color-text-primary) text-3xl md:text-4xl"
          >
            Compete in Our 18 Annual Leagues
          </AnimatedText>
          <p className="mt-2 text-(--color-text-secondary)">
            Cricket, badminton, swimming, and more — competitive leagues across
            12+ sports, year-round.
          </p>
        </div>
        <Button className="shrink-0" href="/events/leagues" variant="secondary">
          View All Leagues
        </Button>
      </div>
    </SectionWrapper>
  );
}
