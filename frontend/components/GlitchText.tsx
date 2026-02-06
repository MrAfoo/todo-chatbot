"use client";

import { useState, useEffect } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export default function GlitchText({ 
  children, 
  className = "", 
  intensity = "medium" 
}: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // Random glitch effect trigger
    const glitchInterval = intensity === "high" ? 3000 : intensity === "medium" ? 5000 : 8000;
    
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 500);
    }, glitchInterval + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <span className={`${className} ${glitching ? 'animate-glitch-intense' : ''}`}>
      {children}
    </span>
  );
}
