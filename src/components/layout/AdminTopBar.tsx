"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { authClient } from "@/lib/auth/auth-client.ts";

interface AdminTopBarProps {
  userName: string;
}

export function AdminTopBar({ userName }: AdminTopBarProps) {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await authClient.signOut();
    router.push("/admin/login");
  }, [router]);

  return (
    <header className="flex items-center justify-between border-(--color-border) border-b bg-(--color-surface) px-6 py-4">
      <p className="text-(--color-text-secondary) text-sm">
        Signed in as{" "}
        <span className="text-(--color-text-primary)">{userName}</span>
      </p>
      <button
        className="flex items-center gap-2 rounded-full border border-(--color-border) px-4 py-2 text-(--color-text-secondary) text-sm transition-colors duration-200 hover:text-primary"
        onClick={handleSignOut}
        type="button"
      >
        <LogOut className="size-4" />
        Sign Out
      </button>
    </header>
  );
}
