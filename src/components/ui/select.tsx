"use client";

import {
  Content as RadixSelectContent,
  Group as RadixSelectGroup,
  Icon as RadixSelectIcon,
  Item as RadixSelectItem,
  ItemIndicator as RadixSelectItemIndicator,
  ItemText as RadixSelectItemText,
  Label as RadixSelectLabel,
  Portal as RadixSelectPortal,
  Root as RadixSelectRoot,
  ScrollDownButton as RadixSelectScrollDownButton,
  ScrollUpButton as RadixSelectScrollUpButton,
  Separator as RadixSelectSeparator,
  Trigger as RadixSelectTrigger,
  Value as RadixSelectValue,
  Viewport as RadixSelectViewport,
} from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils.ts";

function Select({ ...props }: ComponentProps<typeof RadixSelectRoot>) {
  return <RadixSelectRoot data-slot="select" {...props} />;
}

function SelectGroup({ ...props }: ComponentProps<typeof RadixSelectGroup>) {
  return <RadixSelectGroup data-slot="select-group" {...props} />;
}

function SelectValue({ ...props }: ComponentProps<typeof RadixSelectValue>) {
  return <RadixSelectValue data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof RadixSelectTrigger>) {
  return (
    <RadixSelectTrigger
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-(--color-text-primary) outline-none",
        "focus:border-primary focus:ring-1 focus:ring-primary",
        "data-placeholder:text-(--color-text-secondary)",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <RadixSelectIcon asChild>
        <ChevronDown className="size-4 shrink-0 opacity-60" />
      </RadixSelectIcon>
    </RadixSelectTrigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof RadixSelectContent>) {
  return (
    <RadixSelectPortal>
      <RadixSelectContent
        className={cn(
          "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        data-slot="select-content"
        position={position}
        {...props}
      >
        <RadixSelectScrollUpButton className="flex cursor-default items-center justify-center py-1">
          <ChevronUp className="size-4" />
        </RadixSelectScrollUpButton>
        <RadixSelectViewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)"
          )}
        >
          {children}
        </RadixSelectViewport>
        <RadixSelectScrollDownButton className="flex cursor-default items-center justify-center py-1">
          <ChevronDown className="size-4" />
        </RadixSelectScrollDownButton>
      </RadixSelectContent>
    </RadixSelectPortal>
  );
}

function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof RadixSelectLabel>) {
  return (
    <RadixSelectLabel
      className={cn(
        "px-2 py-1.5 text-(--color-text-secondary) text-xs",
        className
      )}
      data-slot="select-label"
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof RadixSelectItem>) {
  return (
    <RadixSelectItem
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pr-8 pl-3 text-(--color-text-primary) text-sm outline-none",
        "data-highlighted:bg-primary/10 data-highlighted:text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      data-slot="select-item"
      {...props}
    >
      <RadixSelectItemText>{children}</RadixSelectItemText>
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <RadixSelectItemIndicator>
          <Check className="size-4" />
        </RadixSelectItemIndicator>
      </span>
    </RadixSelectItem>
  );
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof RadixSelectSeparator>) {
  return (
    <RadixSelectSeparator
      className={cn("-mx-1 my-1 h-px bg-(--color-border)", className)}
      data-slot="select-separator"
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
