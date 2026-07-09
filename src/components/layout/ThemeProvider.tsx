"use client";

import { useEffect } from "react";

const THEME_STORAGE_KEY = "gsc-theme";

const antiFlashScript = `
(function () {
  try {
    var theme = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: anti-flash theme script must run before hydration
  return <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}
