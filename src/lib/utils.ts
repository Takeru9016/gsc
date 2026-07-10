import { type ClassValue, clsx } from "clsx";
import type { PortableTextBlock } from "next-sanity";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PortableTextBlockShape {
  _type: string;
  children?: { text?: string }[];
}

export function getPortableTextSnippet(
  blocks: PortableTextBlock[] | null | undefined,
  maxLength = 140
): string {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  const text = blocks
    .map((block) => {
      const typedBlock = block as unknown as PortableTextBlockShape;
      if (typedBlock._type !== "block" || !typedBlock.children) {
        return "";
      }
      return typedBlock.children.map((child) => child.text ?? "").join("");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > maxLength
    ? `${text.slice(0, maxLength).trimEnd()}…`
    : text;
}
