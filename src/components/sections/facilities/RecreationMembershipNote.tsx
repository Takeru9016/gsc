import { Info } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface RecreationMembershipNoteProps {
  note: string;
}

export function RecreationMembershipNote({
  note,
}: RecreationMembershipNoteProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="flex max-w-3xl items-start gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-6">
        <Info
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-primary"
          size={20}
        />
        <p className="text-(--color-text-primary) text-sm">{note}</p>
      </div>
    </SectionWrapper>
  );
}
