import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CyberpunkThemeProvider } from "@/contexts/CyberpunkThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Terminal Todo - AI-Powered Cyberpunk Task Manager",
  description: "A full-stack task management application with AI-powered assistance, cyberpunk aesthetics, and sound effects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body 
        className={`${inter.className} bg-terminal-bg transition-colors duration-300`}
        suppressHydrationWarning
      >
        <CyberpunkThemeProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </CyberpunkThemeProvider>
      </body>
    </html>
  );
}
