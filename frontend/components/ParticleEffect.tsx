"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export default function ParticleEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: ["#00ff41", "#00ffff", "#ff006e", "#9d4edd", "#0096ff"][
        Math.floor(Math.random() * 5)
      ],
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-float opacity-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
      
      {/* Floating code fragments */}
      <div className="absolute top-10 left-1/4 text-neon-green/20 font-mono text-xs animate-float">
        {"{ task: 'execute' }"}
      </div>
      <div className="absolute top-32 right-1/3 text-neon-cyan/20 font-mono text-xs animate-float" style={{ animationDelay: "1s" }}>
        {">>> processing..."}
      </div>
      <div className="absolute bottom-20 left-1/2 text-neon-purple/20 font-mono text-xs animate-float" style={{ animationDelay: "2s" }}>
        {"[SYSTEM_OK]"}
      </div>
    </div>
  );
}
