"use client";

import {
  Close as RadixDialogClose,
  Content as RadixDialogContent,
  Description as RadixDialogDescription,
  Overlay as RadixDialogOverlay,
  Portal as RadixDialogPortal,
  Root as RadixDialogRoot,
  Title as RadixDialogTitle,
  Trigger as RadixDialogTrigger,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils.ts";

function Dialog({ ...props }: ComponentProps<typeof RadixDialogRoot>) {
  return <RadixDialogRoot data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: ComponentProps<typeof RadixDialogTrigger>) {
  return <RadixDialogTrigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: ComponentProps<typeof RadixDialogPortal>) {
  return <RadixDialogPortal data-slot="dialog-portal" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof RadixDialogOverlay>) {
  return (
    <RadixDialogOverlay
      className={cn("fixed inset-0 z-50 bg-bg-dark/80", className)}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

interface DialogContentProps extends ComponentProps<typeof RadixDialogContent> {
  showClose?: boolean;
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialogContent
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 shadow-md outline-none",
          className
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showClose ? (
          <RadixDialogClose className="absolute top-4 right-4 rounded-full p-1 text-(--color-text-secondary) opacity-70 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </RadixDialogClose>
        ) : null}
      </RadixDialogContent>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 text-left", className)}
      data-slot="dialog-header"
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof RadixDialogTitle>) {
  return (
    <RadixDialogTitle
      className={cn(
        "font-body font-semibold text-(--color-text-primary) text-lg",
        className
      )}
      data-slot="dialog-title"
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof RadixDialogDescription>) {
  return (
    <RadixDialogDescription
      className={cn("text-(--color-text-secondary) text-sm", className)}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
