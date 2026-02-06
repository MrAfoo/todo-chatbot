"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import CyberpunkThemeToggle from "./CyberpunkThemeToggle";
import GlitchText from "./GlitchText";
import { betterAuthWrapper } from "@/lib/auth-wrapper";
import { useRouter } from "next/navigation";
import { getSoundSystem } from "@/lib/sounds";
import { useState, useEffect } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    if (mounted && typeof window !== "undefined") {
      const soundSystem = getSoundSystem();
      soundSystem.buttonClick();
    }
    await betterAuthWrapper.signOut();
    router.push("/login");
  };

  const handleNavClick = () => {
    if (mounted && typeof window !== "undefined") {
      const soundSystem = getSoundSystem();
      soundSystem.buttonHover();
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/chat", label: "AI Assistant", icon: "🤖" },
  ];

  const navItemsConfig = [
    { href: "/dashboard", label: "TASKS", icon: "◈", cmd: "TASK_VIEW" },
    { href: "/chat", label: "CHATBOT", icon: "🤖", cmd: "AI_ASSISTANT" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-neon-green/30 bg-terminal-bgLight/90 backdrop-blur-xl shadow-[0_0_10px_rgba(0,255,65,0.1)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan/20 rounded blur group-hover:bg-neon-cyan/40 transition-all"></div>
              <div className="relative bg-terminal-bg border border-neon-cyan text-neon-cyan px-3 py-2 rounded font-bold text-xl font-mono shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                {'</>'}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-neon-green font-terminal tracking-wider">
                <GlitchText intensity="low">TASKMASTER</GlitchText>
              </span>
              <span className="text-xs text-neon-cyan/70 font-mono">
                v2.0.26_AI
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {navItemsConfig.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded border font-mono font-medium transition-all group ${
                  pathname === item.href
                    ? "bg-neon-green/20 border-neon-green text-neon-green shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                    : "border-neon-cyan/30 text-neon-cyan/80 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:text-neon-cyan hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}

            {/* Sound and Theme Controls */}
            <SoundToggle />
            <CyberpunkThemeToggle />

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 rounded border border-neon-pink/30 font-mono font-medium text-neon-pink/80 hover:bg-neon-pink/10 hover:border-neon-pink hover:text-neon-pink hover:shadow-[0_0_10px_rgba(255,0,110,0.3)] transition-all"
            >
              <span className="text-lg">⏻</span>
              <span className="hidden sm:inline">EXIT</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
