"use client";

import {
  Calendar,
  ChevronDown,
  Contact,
  DoorOpen,
  Download,
  IdCard,
  Images,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Swords,
  Trophy,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils.ts";

interface NavLeaf {
  countKey?: keyof SubmissionCounts;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface SubmissionCounts {
  achievements: number;
  bookings: number;
  contacts: number;
  memberships: number;
  partners: number;
}

const CONTENT_ITEMS: NavLeaf[] = [
  { href: "/admin/content/sports", icon: Trophy, label: "Sports" },
  { href: "/admin/content/events", icon: Calendar, label: "Events" },
  { href: "/admin/content/achievements", icon: Images, label: "Achievements" },
  { href: "/admin/content/dining", icon: UtensilsCrossed, label: "Dining" },
  { href: "/admin/content/banquets", icon: IdCard, label: "Banquets" },
  { href: "/admin/content/membership", icon: IdCard, label: "Membership" },
  {
    href: "/admin/content/booking-config",
    icon: DoorOpen,
    label: "Booking Config",
  },
  { href: "/admin/content/leagues-config", icon: Swords, label: "Leagues" },
  { href: "/admin/content/downloads", icon: Download, label: "Downloads" },
  { href: "/admin/content/settings", icon: Settings, label: "Settings" },
];

const SUBMISSION_ITEMS: NavLeaf[] = [
  {
    countKey: "bookings",
    href: "/admin/submissions/bookings",
    icon: Calendar,
    label: "Bookings",
  },
  {
    countKey: "memberships",
    href: "/admin/submissions/memberships",
    icon: IdCard,
    label: "Memberships",
  },
  {
    countKey: "contacts",
    href: "/admin/submissions/contacts",
    icon: Contact,
    label: "Contacts",
  },
  {
    countKey: "partners",
    href: "/admin/submissions/partners",
    icon: UsersRound,
    label: "Partners",
  },
  {
    countKey: "achievements",
    href: "/admin/submissions/achievements",
    icon: Trophy,
    label: "Achievement Submissions",
  },
];

interface AdminSidebarProps {
  isAdmin: boolean;
  pendingCounts: SubmissionCounts;
}

function NavLink({
  item,
  pendingCounts,
}: {
  item: NavLeaf;
  pendingCounts: SubmissionCounts;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  const badgeCount = item.countKey ? pendingCounts[item.countKey] : undefined;

  return (
    <Link
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border-transparent border-l-2 px-3 py-2 text-sm transition-colors duration-200",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
      )}
      href={item.href}
    >
      <span className="flex items-center gap-2">
        <Icon className="size-4" />
        {item.label}
      </span>
      {badgeCount ? (
        <span className="rounded-full bg-accent-gold/10 px-2 py-0.5 text-accent-gold text-xs">
          {badgeCount}
        </span>
      ) : null}
    </Link>
  );
}

function NavGroup({
  label,
  items,
  pendingCounts,
  defaultOpen,
}: {
  label: string;
  items: NavLeaf[];
  pendingCounts: SubmissionCounts;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between px-3 py-2 font-medium text-(--color-text-secondary) text-xs uppercase tracking-wide"
        onClick={toggleOpen}
        type="button"
      >
        {label}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      </button>
      {open ? (
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              item={item}
              key={item.href}
              pendingCounts={pendingCounts}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AdminSidebar({ isAdmin, pendingCounts }: AdminSidebarProps) {
  const pathname = usePathname();
  const isDashboardActive = pathname === "/admin/dashboard";
  const isUsersActive = pathname.startsWith("/admin/users");

  return (
    <aside className="hidden w-64 shrink-0 border-(--color-border) border-r bg-(--color-surface) md:flex md:flex-col">
      <div className="border-(--color-border) border-b px-6 py-5">
        <p className="font-display font-semibold text-lg uppercase tracking-wide">
          GSC
        </p>
        <p className="text-(--color-text-secondary) text-xs">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <Link
          className={cn(
            "flex items-center gap-2 rounded-lg border-transparent border-l-2 px-3 py-2 text-sm transition-colors duration-200",
            isDashboardActive
              ? "border-primary bg-primary/10 text-primary"
              : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
          )}
          href="/admin/dashboard"
        >
          <LayoutDashboard className="size-4" />
          Overview
        </Link>

        <NavGroup
          defaultOpen
          items={CONTENT_ITEMS}
          label="Content"
          pendingCounts={pendingCounts}
        />

        <NavGroup
          defaultOpen
          items={SUBMISSION_ITEMS}
          label="Submissions"
          pendingCounts={pendingCounts}
        />

        {isAdmin ? (
          <Link
            className={cn(
              "flex items-center gap-2 rounded-lg border-transparent border-l-2 px-3 py-2 text-sm transition-colors duration-200",
              isUsersActive
                ? "border-primary bg-primary/10 text-primary"
                : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
            )}
            href="/admin/users"
          >
            <ShieldCheck className="size-4" />
            Users
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
