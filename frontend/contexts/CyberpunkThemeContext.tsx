"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSoundSystem } from "@/lib/sounds";

export type CyberpunkTheme = "hacker" | "neon-light" | "matrix" | "vaporwave";

interface CyberpunkThemeContextType {
  theme: CyberpunkTheme;
  setTheme: (theme: CyberpunkTheme) => void;
  cycleTheme: () => void;
}

const CyberpunkThemeContext = createContext<CyberpunkThemeContextType | undefined>(undefined);

const themes: CyberpunkTheme[] = ["hacker", "neon-light", "matrix", "vaporwave"];

export function CyberpunkThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<CyberpunkTheme>("hacker");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cyberpunk-theme") as CyberpunkTheme;
      if (stored && themes.includes(stored)) {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", "hacker");
      }
    }
  }, []);

  const setTheme = (newTheme: CyberpunkTheme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("cyberpunk-theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      
      // Play sound effect
      const soundSystem = getSoundSystem();
      soundSystem.themeToggle();
    }
  };

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CyberpunkThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </CyberpunkThemeContext.Provider>
  );
}

export function useCyberpunkTheme() {
  const context = useContext(CyberpunkThemeContext);
  if (context === undefined) {
    // Return default values if not within provider (shouldn't happen, but defensive)
    return {
      theme: "hacker" as CyberpunkTheme,
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return context;
}
