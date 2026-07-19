import { type ClassValue, clsx } from "clsx";
import type { PortableTextBlock } from "next-sanity";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = "gold" | "green" | "outline" | "primary" | "red";

const GREEN_STATUSES = new Set([
  "confirmed",
  "responded",
  "approved",
  "active",
  "upcoming",
]);
const RED_STATUSES = new Set(["rejected", "cancelled", "declined"]);
const PRIMARY_STATUSES = new Set([
  "reviewed",
  "reviewing",
  "contacted",
  "negotiating",
  "ongoing",
]);

export function getStatusBadgeVariant(status: string): BadgeVariant {
  if (status === "pending") {
    return "gold";
  }
  if (GREEN_STATUSES.has(status)) {
    return "green";
  }
  if (RED_STATUSES.has(status)) {
    return "red";
  }
  if (PRIMARY_STATUSES.has(status)) {
    return "primary";
  }
  return "outline";
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

export function portableTextToPlainText(
  blocks: PortableTextBlock[] | null | undefined
): string {
  if (!blocks || blocks.length === 0) {
    return "";
  }

  return blocks
    .map((block) => {
      const typedBlock = block as unknown as PortableTextBlockShape;
      if (typedBlock._type !== "block" || !typedBlock.children) {
        return "";
      }
      return typedBlock.children.map((child) => child.text ?? "").join("");
    })
    .join("\n\n");
}

function generateKey() {
  return Math.random().toString(36).slice(2);
}

const MULTIPLE_NEWLINES_PATTERN = /\n{2,}/;

export function plainTextToPortableText(text: string): PortableTextBlock[] {
  const paragraphs = text
    .split(MULTIPLE_NEWLINES_PATTERN)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return paragraphs.map(
    (paragraph) =>
      ({
        _key: generateKey(),
        _type: "block",
        children: [
          { _key: generateKey(), _type: "span", marks: [], text: paragraph },
        ],
        markDefs: [],
        style: "normal",
      }) as unknown as PortableTextBlock
  );
}

export function getPortableTextListItems(
  blocks: PortableTextBlock[] | null | undefined,
  limit: number
): string[] {
  if (!blocks || blocks.length === 0) {
    return [];
  }

  const items = blocks
    .map((block) => {
      const typedBlock = block as unknown as PortableTextBlockShape;
      if (typedBlock._type !== "block" || !typedBlock.children) {
        return "";
      }
      return typedBlock.children.map((child) => child.text ?? "").join("");
    })
    .filter((text) => text.trim().length > 0);

  return items.slice(0, limit);
}
