import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/shared/forms/AdminLoginForm.tsx";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-(--color-border) bg-(--color-surface) p-8">
        <div className="mb-8 text-center">
          <p className="font-display font-semibold text-(--color-text-primary) text-2xl uppercase tracking-wide">
            GSC
          </p>
          <p className="mt-1 text-(--color-text-secondary) text-sm">
            Admin Panel
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
