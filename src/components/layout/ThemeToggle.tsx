"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "gsc-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const nextIsDark = !prev;
      document.documentElement.classList.toggle("dark", nextIsDark);
      localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? "dark" : "light");
      return nextIsDark;
    });
  }, []);

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center justify-center rounded-full p-2 text-secondary transition-all duration-200 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
