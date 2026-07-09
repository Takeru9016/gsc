import type { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  contained?: boolean;
  id?: string;
  noPadding?: boolean;
}

export function SectionWrapper({
  children,
  id,
  className,
  contained = true,
  noPadding = false,
}: SectionWrapperProps) {
  return (
    <section
      className={cn(!noPadding && "py-16 md:py-24 lg:py-32", className)}
      id={id}
    >
      {contained ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
