import type { PortableTextBlock, PortableTextComponents } from "next-sanity";
import { PortableText } from "next-sanity";
import { cn } from "@/lib/utils.ts";

interface PortableTextRendererProps {
  className?: string;
  value: PortableTextBlock[];
}

const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-primary border-l-4 pl-4 text-(--color-text-secondary) italic">
        {children}
      </blockquote>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 font-body font-semibold text-(--color-text-primary) text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 font-body font-semibold text-(--color-text-primary) text-xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-(--color-text-secondary) text-base leading-relaxed">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-inside list-disc space-y-2 text-(--color-text-secondary)">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-inside list-decimal space-y-2 text-(--color-text-secondary)">
        {children}
      </ol>
    ),
  },
};

export function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  return (
    <div className={cn(className)}>
      <PortableText components={components} value={value} />
    </div>
  );
}
