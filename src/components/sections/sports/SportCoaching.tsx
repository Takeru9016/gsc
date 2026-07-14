import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Badge } from "@/components/shared/Badge.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface SportCoachingProps {
  coachingLevel: string | null;
  coachingSchedule: string | null;
  coachName: string | null;
  externalRegistrationUrl: string | null;
}

export function SportCoaching({
  coachName,
  coachingSchedule,
  coachingLevel,
  externalRegistrationUrl,
}: SportCoachingProps) {
  return (
    <SectionWrapper className="pt-0">
      <AnimatedText
        as="h2"
        className="mb-8 font-display text-(--color-text-primary) text-3xl md:text-4xl"
      >
        Coaching
      </AnimatedText>
      <div className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          {coachingLevel ? <Badge variant="gold">{coachingLevel}</Badge> : null}
          {coachName ? (
            <span className="font-body font-semibold text-(--color-text-primary)">
              Coach: {coachName}
            </span>
          ) : null}
        </div>
        <p className="text-(--color-text-secondary)">
          {coachingSchedule ?? "[PENDING_CONTENT] — Coaching schedule."}
        </p>
        {externalRegistrationUrl ? (
          <Button
            className="self-start"
            external
            href={externalRegistrationUrl}
          >
            Register
          </Button>
        ) : (
          <Button className="self-start" href="/contact">
            Contact Us to Register
          </Button>
        )}
      </div>
    </SectionWrapper>
  );
}
