"use client";

import { AchievementSubmitForm } from "@/components/shared/forms/AchievementSubmitForm.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";

export function AchievementSubmitCTA() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div>
        <h2 className="font-display text-(--color-text-primary) text-3xl md:text-4xl">
          Are You a GSC Champion?
        </h2>
        <p className="mt-2 text-(--color-text-secondary)">
          Share your achievement and we'll add it to the champions wall.
        </p>
      </div>
      <Dialog>
        <DialogTrigger className="inline-flex min-w-[120px] shrink-0 items-center justify-center rounded-full bg-accent-gold px-6 py-3 font-medium text-black transition-all duration-200 hover:opacity-90">
          Submit Your Achievement
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Your Achievement</DialogTitle>
            <DialogDescription>
              Tell us about your win. Our team reviews every submission before
              it goes live.
            </DialogDescription>
          </DialogHeader>
          <AchievementSubmitForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
