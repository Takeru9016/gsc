import type { LucideIcon } from "lucide-react";
import { FileText, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AnimatedText } from "@/components/shared/AnimatedText.tsx";
import { SectionWrapper } from "@/components/shared/SectionWrapper.tsx";
import { StaggerReveal } from "@/components/shared/StaggerReveal.tsx";

interface PolicyLink {
  cta: string;
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
}

const POLICY_LINKS: PolicyLink[] = [
  {
    cta: "Read Policy",
    description: "How we collect and use your information.",
    href: "/legal#privacy",
    icon: ShieldCheck,
    title: "Privacy Policy",
  },
  {
    cta: "Read Terms",
    description: "Terms governing use of our facilities and website.",
    href: "/legal#terms",
    icon: FileText,
    title: "Terms of Use",
  },
  {
    cta: "View Policy",
    description: "Our refund and cancellation terms.",
    href: "/legal/cancellation",
    icon: RotateCcw,
    title: "Cancellation Policy",
  },
];

export function PolicyLinksSection() {
  return (
    <SectionWrapper>
      <div className="mb-8 md:mb-12 lg:mb-16">
        <AnimatedText
          as="h2"
          className="font-display text-(--color-text-primary) text-4xl md:text-5xl"
        >
          Policies
        </AnimatedText>
      </div>
      <StaggerReveal className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
        {POLICY_LINKS.map((policy) => (
          <Link
            className="group flex flex-col gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md md:p-8"
            href={policy.href}
            key={policy.title}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <policy.icon aria-hidden="true" size={22} />
            </span>
            <div>
              <h3 className="font-body font-semibold text-(--color-text-primary) text-xl">
                {policy.title}
              </h3>
              <p className="mt-2 text-(--color-text-secondary) text-sm">
                {policy.description}
              </p>
            </div>
            <span className="mt-auto font-medium text-primary text-sm group-hover:underline">
              {policy.cta} →
            </span>
          </Link>
        ))}
      </StaggerReveal>
    </SectionWrapper>
  );
}
