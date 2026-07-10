import { AlertTriangle } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

export function DiningVenueAgeDisclaimer() {
  return (
    <SectionWrapper className="pt-0">
      <div className="mx-auto flex max-w-4xl items-start gap-4 rounded-2xl border-2 border-accent-red bg-accent-red/10 p-6 md:p-8">
        <AlertTriangle
          aria-hidden="true"
          className="mt-1 size-6 shrink-0 text-accent-red"
        />
        <p className="text-(--color-text-primary)">
          <span className="font-semibold">
            Bleu Restobar serves alcoholic beverages.
          </span>{" "}
          Entry is restricted to guests 25 years of age and above. Valid
          government-issued ID required. Drink responsibly.
        </p>
      </div>
    </SectionWrapper>
  );
}
