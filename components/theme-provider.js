"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "greencart-theme";
const THEMES = ["light", "dark"];

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  themes: THEMES,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [mounted, setMounted] = useState(false);

  // Read saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const preferred = saved ?? (
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );
    applyTheme(preferred);
    setThemeState(preferred);
    setMounted(true);
  }, []);

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
  }

  function setTheme(t) {
    applyTheme(t);
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  }

  // Inject a blocking script so there's no flash of wrong theme on SSR
  // (runs synchronously before paint)
  const script = `
    (function(){
      var t = localStorage.getItem('${STORAGE_KEY}');
      if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', t);
    })();
  `;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {/* Anti-flash script — runs before React hydration */}
      <script dangerouslySetInnerHTML={{ __html: script }} />
      {children}
    </ThemeContext.Provider>
  );
}
