import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import type { MembershipConfig } from "@/lib/sanity/queries.ts";

const DEFAULT_CLOSED_NOTICE =
  "Membership enrollment is currently paused. Express your interest and you'll be notified when enrollment opens.";
const OPEN_NOTICE = "Enrollment is now open! Apply below.";

interface EnrollmentBannerProps {
  membershipConfig: MembershipConfig | null;
}

export function EnrollmentBanner({ membershipConfig }: EnrollmentBannerProps) {
  const enrollmentOpen = membershipConfig?.enrollmentOpen ?? false;

  const notice = enrollmentOpen
    ? OPEN_NOTICE
    : (membershipConfig?.enrollmentNotice ?? DEFAULT_CLOSED_NOTICE);

  return (
    <SectionWrapper noPadding>
      <div className="pt-16 md:pt-24 lg:pt-32">
        <div
          className={
            enrollmentOpen
              ? "rounded-2xl border border-accent-green/20 bg-accent-green/10 p-6 text-accent-green md:p-8"
              : "rounded-2xl border border-accent-gold/20 bg-accent-gold/10 p-6 text-accent-gold md:p-8"
          }
        >
          <p className="font-body font-semibold text-lg">
            {enrollmentOpen ? "Enrollment Open" : "Enrollment Paused"}
          </p>
          <p className="mt-2 text-(--color-text-secondary)">{notice}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
