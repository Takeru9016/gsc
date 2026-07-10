import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface RecreationInfoSectionProps {
  content: string;
  title: string;
}

export function RecreationInfoSection({
  content,
  title,
}: RecreationInfoSectionProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="max-w-3xl rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:p-8">
        <h2 className="font-body font-semibold text-(--color-text-primary) text-2xl">
          {title}
        </h2>
        <p className="mt-4 text-(--color-text-secondary)">{content}</p>
      </div>
    </SectionWrapper>
  );
}
