import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { PortableTextRenderer } from "@/components/shared/PortableTextRenderer.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { LegalPage } from "@/lib/sanity/queries.ts";

interface LegalPolicySectionProps {
  fallbackTitle: string;
  id?: string;
  legalPage: LegalPage | null;
  pendingMessage?: string;
}

const DEFAULT_PENDING_MESSAGE =
  "This policy has not been published yet. Contact us for current terms.";

export function LegalPolicySection({
  id,
  fallbackTitle,
  legalPage,
  pendingMessage = DEFAULT_PENDING_MESSAGE,
}: LegalPolicySectionProps) {
  const lastUpdated = legalPage?.lastUpdated
    ? new Date(legalPage.lastUpdated).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <SectionWrapper id={id}>
      <AnimatedText
        as="h2"
        className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
      >
        {legalPage?.title ?? fallbackTitle}
      </AnimatedText>
      {lastUpdated ? (
        <p className="mt-2 text-(--color-text-secondary) text-sm">
          Last updated: {lastUpdated}
        </p>
      ) : null}
      <div className="mt-8 max-w-3xl">
        {legalPage?.content ? (
          <PortableTextRenderer value={legalPage.content} />
        ) : (
          <p className="text-(--color-text-secondary)">
            {/* [PENDING_CONTENT] — awaiting legalPage document in Sanity */}
            [PENDING_CONTENT] {pendingMessage}
          </p>
        )}
      </div>
    </SectionWrapper>
  );
}
