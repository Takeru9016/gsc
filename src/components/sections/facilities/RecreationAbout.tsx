import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface RecreationAboutProps {
  paragraphs: string[];
  title?: string;
}

export function RecreationAbout({
  paragraphs,
  title = "About",
}: RecreationAboutProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="max-w-3xl">
        <AnimatedText
          as="h2"
          className="font-body font-semibold text-(--color-text-primary) text-2xl"
        >
          {title}
        </AnimatedText>
        <div className="mt-4 space-y-4 text-(--color-text-secondary)">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
