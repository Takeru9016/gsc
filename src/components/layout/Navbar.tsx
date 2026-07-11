"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu.tsx";
import { ThemeToggle } from "@/components/layout/ThemeToggle.tsx";
import { cn } from "@/lib/utils.ts";

const SCROLL_THRESHOLD = 80;

export interface NavChild {
  href: string;
  label: string;
}

export interface NavItem {
  children?: NavChild[];
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  {
    children: [
      { href: "/sports#outdoor", label: "Outdoor" },
      { href: "/sports#indoor", label: "Indoor" },
      { href: "/sports#aquatic", label: "Aquatic" },
      { href: "/sports#health-fitness", label: "Health & Fitness" },
      { href: "/sports#track", label: "Track" },
      { href: "/sports", label: "View All Sports" },
    ],
    href: "/sports",
    label: "Sports",
  },
  {
    children: [
      { href: "/events?status=upcoming", label: "Upcoming Events" },
      { href: "/events/leagues", label: "Leagues" },
      { href: "/events", label: "View All Events" },
    ],
    href: "/events",
    label: "Events",
  },
  {
    children: [
      { href: "/facilities/rooms", label: "Rooms" },
      { href: "/facilities/banquets", label: "Banquets" },
      { href: "/facilities/dining", label: "Dining" },
      { href: "/facilities/recreation", label: "Recreation" },
      { href: "/facilities", label: "View All Facilities" },
    ],
    href: "/facilities",
    label: "Facilities",
  },
  { href: "/booking", label: "Booking" },
  {
    children: [
      { href: "/membership/life", label: "Life" },
      { href: "/membership/corporate", label: "Corporate" },
      { href: "/membership/ward", label: "Ward" },
      { href: "/membership/service", label: "Service" },
      { href: "/membership/yearly", label: "Yearly" },
      { href: "/membership/affiliated-clubs", label: "Affiliated Clubs" },
      { href: "/membership", label: "View All Membership" },
    ],
    href: "/membership",
    label: "Membership",
  },
  { href: "/achievements", label: "Achievements" },
  {
    children: [
      { href: "/partners/team-spirit", label: "Team Spirit" },
      { href: "/partners/annual-report", label: "Annual Report" },
      { href: "/partners", label: "View All Partners" },
    ],
    href: "/partners",
    label: "Partners",
  },
  {
    children: [
      { href: "/about/team", label: "Committee" },
      { href: "/about/bye-laws", label: "Bye-Laws" },
      { href: "/about", label: "View All About" },
    ],
    href: "/about",
    label: "About",
  },
];

// Last item in each dropdown ("View All X") duplicates the parent link — render a divider before it.
const DROPDOWN_DIVIDER_INDEX_FROM_END = 1;

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMobileMenu = useCallback(() => setIsMobileOpen(true), []);
  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        isScrolled
          ? "border-border-dark border-b bg-surface-dark"
          : "bg-transparent"
      )}
      data-theme="dark"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          className="font-display text-2xl text-primary-dark tracking-wide"
          href="/"
        >
          GSC
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href);

            return (
              <li className="group relative" key={item.href}>
                <Link
                  className={cn(
                    "relative inline-flex items-center py-2 font-medium text-sm transition-colors duration-200",
                    active
                      ? "text-primary"
                      : "text-(--color-text-secondary) hover:text-primary"
                  )}
                  href={item.href}
                >
                  {item.label.toUpperCase()}
                  {active ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                  ) : null}
                </Link>

                {item.children ? (
                  <div className="invisible absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-56 rounded-2xl border border-border-dark bg-elevated-dark p-2 shadow-md">
                      {item.children.map((child, index, children) => {
                        const isBeforeLast =
                          index ===
                          children.length - 1 - DROPDOWN_DIVIDER_INDEX_FROM_END;

                        return (
                          <li key={child.href}>
                            <Link
                              className="block whitespace-nowrap rounded-xl px-3 py-2 text-(--color-text-secondary) text-sm transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                              href={child.href}
                            >
                              {child.label}
                            </Link>
                            {isBeforeLast ? (
                              <hr className="my-2 border-border-dark" />
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <button
            aria-controls="mobile-menu"
            aria-expanded={isMobileOpen}
            aria-label="Open menu"
            className="inline-flex items-center justify-center rounded-full p-2 text-(--color-text-secondary) transition-all duration-200 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            onClick={openMobileMenu}
            type="button"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileOpen}
        navItems={NAV_ITEMS}
        onClose={closeMobileMenu}
        pathname={pathname}
      />
    </header>
  );
}
