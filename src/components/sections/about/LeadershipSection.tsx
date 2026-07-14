import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { Button } from "@/components/shared/Button.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function LeadershipSection() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl text-center">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Leadership
        </AnimatedText>
        <AnimatedText
          as="p"
          className="mt-4 text-(--color-text-secondary) text-lg"
          delay={0.1}
        >
          GSC is led by a dedicated committee of founding and promoter members,
          office bearers, and a governing council — each committed to preserving
          the club's legacy while steering its future growth.
        </AnimatedText>
        <Button className="mt-8" href="/about/team" variant="secondary">
          Meet Our Committee
        </Button>
      </div>
    </SectionWrapper>
  );
}
