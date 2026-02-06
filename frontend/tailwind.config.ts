import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Hacker theme colors
        "neon-green": "#00ff41",
        "neon-cyan": "#00ffff",
        "neon-pink": "#ff006e",
        "neon-purple": "#9d4edd",
        "neon-blue": "#0096ff",
        "neon-yellow": "#ffff00",
        terminal: {
          bg: "#0a0e27",
          bgLight: "#0f1419",
          border: "#1a1f3a",
          text: "#00ff41",
        },
      },
      fontFamily: {
        mono: ["'Fira Code'", "'Courier New'", "monospace"],
        terminal: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "glitch": "glitch 0.3s linear infinite",
        "glitch-intense": "glitch-intense 0.5s ease-in-out infinite",
        "typing": "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
        "matrix-rain": "matrix-rain 20s linear infinite",
        "scan-line": "scan-line 6s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "particle-float": "particle-float 4s ease-in-out infinite",
        "neon-flicker": "neon-flicker 1.5s infinite",
        "data-stream": "data-stream 3s linear infinite",
        "hologram": "hologram 2s ease-in-out infinite",
        "cyber-pulse": "cyber-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px rgba(0, 255, 65, 0.5), 0 0 10px rgba(0, 255, 65, 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.8), 0 0 30px rgba(0, 255, 65, 0.5)",
          },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        "glitch-intense": {
          "0%, 100%": { 
            transform: "translate(0)",
            textShadow: "0 0 5px rgba(0, 255, 255, 0.7), 0 0 10px rgba(255, 0, 110, 0.5)",
          },
          "20%": { 
            transform: "translate(-3px, 3px)",
            textShadow: "3px 0 0 rgba(255, 0, 110, 0.7), -3px 0 0 rgba(0, 255, 255, 0.7)",
          },
          "40%": { 
            transform: "translate(3px, -3px)",
            textShadow: "-3px 0 0 rgba(0, 255, 255, 0.7), 3px 0 0 rgba(255, 0, 110, 0.7)",
          },
          "60%": { 
            transform: "translate(-2px, -2px)",
            textShadow: "2px 0 0 rgba(0, 255, 65, 0.7), -2px 0 0 rgba(157, 78, 221, 0.7)",
          },
          "80%": { 
            transform: "translate(2px, 2px)",
            textShadow: "-2px 0 0 rgba(157, 78, 221, 0.7), 2px 0 0 rgba(0, 255, 65, 0.7)",
          },
        },
        "typing": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "blink-caret": {
          "from, to": { borderColor: "transparent" },
          "50%": { borderColor: "#00ff41" },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "particle-float": {
          "0%": { 
            transform: "translate(0, 0) scale(1)",
            opacity: "0",
          },
          "50%": { 
            opacity: "1",
          },
          "100%": { 
            transform: "translate(var(--tw-translate-x, 0), -100px) scale(0.5)",
            opacity: "0",
          },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            opacity: "1",
            textShadow: "0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3)",
          },
          "20%, 24%, 55%": {
            opacity: "0.8",
            textShadow: "none",
          },
        },
        "data-stream": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "hologram": {
          "0%, 100%": {
            opacity: "1",
            transform: "skewY(0deg)",
          },
          "50%": {
            opacity: "0.8",
            transform: "skewY(0.5deg)",
          },
        },
        "cyber-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.05)",
          },
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
