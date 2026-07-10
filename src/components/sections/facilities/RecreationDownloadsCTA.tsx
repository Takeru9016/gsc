import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function RecreationDownloadsCTA() {
  return (
    <SectionWrapper className="pt-0">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <AnimatedText
            as="h2"
            className="font-body font-semibold text-(--color-text-primary) text-2xl"
          >
            Looking for the Housie Schedule?
          </AnimatedText>
          <p className="mt-2 text-(--color-text-secondary)">
            Find the latest Housie night notice in the downloads section.
          </p>
        </div>
        <Link
          className="inline-flex min-w-[120px] shrink-0 items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
          href="/downloads"
        >
          View Downloads
        </Link>
      </div>
    </SectionWrapper>
  );
}
