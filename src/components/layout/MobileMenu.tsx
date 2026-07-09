"use client";

import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { NavItem } from "@/components/layout/Navbar.tsx";
import { ThemeToggle } from "@/components/layout/ThemeToggle.tsx";
import { cn } from "@/lib/utils.ts";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
  pathname: string;
}

function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu({
  isOpen,
  navItems,
  onClose,
  pathname,
}: MobileMenuProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const handleToggleCategory = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const { href } = event.currentTarget.dataset;
      if (!href) {
        return;
      }
      setOpenCategory((prev) => (prev === href ? null : href));
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
      data-theme="dark"
    >
      <button
        aria-label="Close menu"
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        type="button"
      />

      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-(--color-surface-dark) transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        id="mobile-menu"
      >
        <div className="flex items-center justify-between border-border-dark border-b px-4 py-5 sm:px-6">
          <span className="font-display text-(--color-primary-dark) text-2xl tracking-wide">
            GSC
          </span>
          <button
            aria-label="Close menu"
            className="inline-flex items-center justify-center rounded-full p-2 text-(--color-text-secondary) transition-all duration-200 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={onClose}
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="flex-1 px-4 py-4 sm:px-6">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const isCategoryOpen = openCategory === item.href;

            return (
              <li
                className="border-border-dark border-b last:border-b-0"
                key={item.href}
              >
                <div className="flex items-center justify-between">
                  <Link
                    className={cn(
                      "flex-1 py-4 font-medium text-base transition-colors duration-200",
                      active ? "text-primary" : "text-(--color-text-primary)"
                    )}
                    href={item.href}
                    onClick={onClose}
                  >
                    {item.label.toUpperCase()}
                  </Link>
                  {item.children ? (
                    <button
                      aria-expanded={isCategoryOpen}
                      aria-label={`Toggle ${item.label} submenu`}
                      className="p-4 text-(--color-text-secondary)"
                      data-href={item.href}
                      onClick={handleToggleCategory}
                      type="button"
                    >
                      <ChevronDown
                        className={cn(
                          "transition-transform duration-200",
                          isCategoryOpen && "rotate-180"
                        )}
                        size={18}
                      />
                    </button>
                  ) : null}
                </div>

                {item.children && isCategoryOpen ? (
                  <ul className="pb-3 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          className="block py-2.5 text-(--color-text-secondary) text-sm transition-colors duration-200 hover:text-primary"
                          href={child.href}
                          onClick={onClose}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="border-border-dark border-t px-4 py-5 sm:px-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
