"use client";

import { useState, useEffect } from "react";
import { useCyberpunkTheme } from "@/contexts/CyberpunkThemeContext";
import type { CyberpunkTheme } from "@/contexts/CyberpunkThemeContext";

const themeInfo: Record<CyberpunkTheme, { name: string; icon: string; color: string }> = {
  hacker: { name: "Hacker Dark", icon: "💀", color: "text-neon-green" },
  "neon-light": { name: "Neon Light", icon: "💡", color: "text-neon-cyan" },
  matrix: { name: "Matrix Rain", icon: "🟢", color: "text-neon-green" },
  vaporwave: { name: "Vaporwave", icon: "🌸", color: "text-neon-pink" },
};

export default function CyberpunkThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, cycleTheme } = useCyberpunkTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return (
      <button 
        disabled
        className="group relative inline-flex items-center gap-2 rounded-lg bg-terminal-bgLight border border-neon-purple/30 px-4 py-2 text-neon-purple opacity-50"
      >
        <span className="text-lg">💀</span>
        <span className="font-mono text-xs text-neon-green font-semibold">
          [LOADING...]
        </span>
      </button>
    );
  }

  const currentTheme = themeInfo[theme] || themeInfo.hacker;

  return (
    <button
      onClick={cycleTheme}
      className="group relative inline-flex items-center gap-2 rounded-lg bg-terminal-bgLight border border-neon-purple/30 px-4 py-2 text-neon-purple hover:border-neon-purple hover:shadow-[0_0_15px_rgba(157,78,221,0.3)] transition-all duration-200 transform hover:scale-105"
      aria-label="Cycle theme"
      title={`Current: ${currentTheme.name}`}
    >
      <span className="text-lg animate-cyber-pulse">{currentTheme.icon}</span>
      <span className={`font-mono text-xs ${currentTheme.color} font-semibold`}>
        [{currentTheme.name.toUpperCase()}]
      </span>
      
      {/* Theme indicator */}
      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-purple animate-ping"></span>
    </button>
  );
}
