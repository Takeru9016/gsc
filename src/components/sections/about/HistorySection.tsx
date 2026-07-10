import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

// [PENDING_CONTENT] — sourced from the `aboutPage` Sanity singleton once that
// schema exists (see docs/spec/PAGES.md § About). Placeholder copy until then.
const HISTORY_PARAGRAPHS = [
  {
    id: "founding",
    text: "Founded over three decades ago, Goregaon Sports Club began as a modest community initiative to bring organized sport to Mumbai's western suburbs. What started with a handful of courts and a shared love of the game has grown into one of the city's most comprehensive multi-sport institutions.",
  },
  {
    id: "growth",
    text: "Today, GSC is home to 23+ sports disciplines, world-class banquet and dining facilities, and a thriving community of over 12,000 members. Our founding members' vision — a club built by and for its community — continues to guide every decision we make.",
  },
];

export function HistorySection() {
  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        <div>
          <AnimatedText
            as="h2"
            className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
          >
            History & Legacy
          </AnimatedText>
          <div className="mt-6 flex flex-col gap-4">
            {HISTORY_PARAGRAPHS.map((paragraph, index) => (
              <AnimatedText
                as="p"
                className="text-(--color-text-secondary) text-lg leading-relaxed"
                delay={index * 0.1}
                key={paragraph.id}
              >
                {paragraph.text}
              </AnimatedText>
            ))}
          </div>
        </div>
        {/* [PENDING_CONTENT] — historic club image from Sanity aboutPage singleton */}
        <div className="aspect-4/3 w-full rounded-2xl bg-surface-dark" />
      </div>
    </SectionWrapper>
  );
}
