"use client";

import { useState, useEffect } from "react";
import { getSoundSystem } from "@/lib/sounds";

export default function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const soundSystem = getSoundSystem();
      setSoundEnabled(soundSystem.isEnabled());
    }
  }, []);

  const toggleSound = () => {
    const soundSystem = getSoundSystem();
    const newState = soundSystem.toggleSound();
    setSoundEnabled(newState);
    
    // Play a test sound when enabling
    if (newState) {
      soundSystem.notification();
    }
  };

  if (!mounted) {
    return (
      <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-terminal-bgLight border border-neon-cyan/30 text-neon-cyan/50">
        <span className="text-xl">🔇</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleSound}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-terminal-bgLight border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-200 transform hover:scale-110"
      aria-label="Toggle sound effects"
      title={soundEnabled ? "Disable sound effects" : "Enable sound effects"}
    >
      {soundEnabled ? (
        <span className="text-xl animate-pulse-glow">🔊</span>
      ) : (
        <span className="text-xl opacity-50">🔇</span>
      )}
      
      {/* Sound waves animation when enabled */}
      {soundEnabled && (
        <>
          <span className="absolute left-full ml-1 h-1 w-1 rounded-full bg-neon-cyan animate-ping opacity-75"></span>
          <span className="absolute left-full ml-2 h-1 w-1 rounded-full bg-neon-cyan animate-ping opacity-50" style={{ animationDelay: "0.1s" }}></span>
          <span className="absolute left-full ml-3 h-1 w-1 rounded-full bg-neon-cyan animate-ping opacity-25" style={{ animationDelay: "0.2s" }}></span>
        </>
      )}
    </button>
  );
}
