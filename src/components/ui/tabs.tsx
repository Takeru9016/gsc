"use client";

import {
  Content as RadixTabsContent,
  List as RadixTabsList,
  Root as RadixTabsRoot,
  Trigger as RadixTabsTrigger,
} from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils.ts";

function Tabs({ className, ...props }: ComponentProps<typeof RadixTabsRoot>) {
  return (
    <RadixTabsRoot
      className={cn("flex flex-col gap-4", className)}
      data-slot="tabs"
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof RadixTabsList>) {
  return (
    <RadixTabsList
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) p-1",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof RadixTabsTrigger>) {
  return (
    <RadixTabsTrigger
      className={cn(
        "rounded-full px-4 py-2 font-medium text-(--color-text-secondary) text-sm transition-all duration-200",
        "data-[state=active]:bg-primary data-[state=active]:text-white",
        "hover:text-primary data-[state=active]:hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof RadixTabsContent>) {
  return (
    <RadixTabsContent
      className={cn("focus-visible:outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
