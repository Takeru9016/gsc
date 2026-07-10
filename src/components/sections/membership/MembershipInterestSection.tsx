import { MembershipInterestForm } from "@/components/shared/forms/MembershipInterestForm.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

interface MembershipInterestSectionProps {
  enrollmentNotice: string | null;
  membershipType: string;
  membershipTypeLabel: string;
}

const DEFAULT_NOTICE =
  "Enrollment is currently paused. We'll notify you when it opens.";

export function MembershipInterestSection({
  membershipType,
  membershipTypeLabel,
  enrollmentNotice,
}: MembershipInterestSectionProps) {
  return (
    <SectionWrapper className="pt-0">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-(--color-text-primary) text-3xl md:text-4xl">
          Express Your Interest
        </h2>
        <p className="mt-2 mb-8 text-(--color-text-secondary)">
          {enrollmentNotice ?? DEFAULT_NOTICE}
        </p>
        <MembershipInterestForm
          membershipType={membershipType}
          membershipTypeLabel={membershipTypeLabel}
        />
      </div>
    </SectionWrapper>
  );
}
