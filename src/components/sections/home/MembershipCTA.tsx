import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";

const MEMBERSHIP_TYPES = ["Life", "Corporate", "Ward", "Service", "Yearly"];

export function MembershipCTA() {
  return (
    <div className="bg-bg-dark" data-theme="dark">
      <SectionWrapper>
        <div className="mx-auto max-w-2xl text-center">
          <AnimatedText
            as="h2"
            className="font-display text-4xl text-text-primary-dark md:text-5xl"
          >
            Become Part of the Legacy
          </AnimatedText>
          <p className="mt-4 text-text-secondary-dark">
            Membership enrollment is currently paused. Express your interest and
            we'll notify you when enrollment opens.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {MEMBERSHIP_TYPES.map((type) => (
              <span
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary text-sm"
                key={type}
              >
                {type}
              </span>
            ))}
          </div>
          <Link
            className="mt-8 inline-flex min-w-[120px] items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-primary-hover"
            href="/membership"
          >
            Express Interest
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
}
