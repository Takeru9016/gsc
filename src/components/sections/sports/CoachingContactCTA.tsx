import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function CoachingContactCTA() {
  return (
    <SectionWrapper>
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <AnimatedText
            as="h2"
            className="font-body font-semibold text-(--color-text-primary) text-2xl"
          >
            Don't See Your Sport?
          </AnimatedText>
          <p className="mt-2 text-(--color-text-secondary)">
            Ask us — we're always expanding our coaching programs.
          </p>
        </div>
        <Link
          className="inline-flex min-w-[120px] shrink-0 items-center justify-center rounded-full border border-primary px-6 py-3 font-medium text-primary transition-all duration-200 hover:bg-primary/10"
          href="/contact"
        >
          Ask Us
        </Link>
      </div>
    </SectionWrapper>
  );
}
