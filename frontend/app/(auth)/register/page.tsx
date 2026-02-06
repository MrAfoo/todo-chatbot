"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { betterAuthWrapper } from "@/lib/auth-wrapper";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const result = await betterAuthWrapper.signUp.email({
        email,
        password,
        name,
      });

      // Check for errors in the result
      if (result?.error) {
        const errorMsg = result.error.message || "Failed to create account";
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Check if registration was successful
      if (result?.data) {
        // Successful registration - redirect to dashboard
        router.push("/dashboard");
      } else {
        // No error but also no data - something went wrong
        setError("Registration failed. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      // Catch any unexpected errors
      console.error("Registration error:", err);
      const errorMsg = err?.message || err?.toString() || "Failed to create account. Please try again.";
      setError(errorMsg);
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = ["", "red", "orange", "yellow", "green", "emerald"];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-terminal-bg relative flex items-center justify-center p-4 overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-green to-transparent animate-matrix-rain" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan to-transparent animate-matrix-rain" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-neon-green to-transparent animate-matrix-rain" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative w-full max-w-md animate-fadeIn z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded border-2 border-neon-purple bg-terminal-bgLight shadow-[0_0_30px_rgba(157,78,221,0.5)] mb-4 animate-pulse-glow">
            <span className="text-4xl text-neon-purple">🚀</span>
          </div>
          <h1 className="text-4xl font-bold font-terminal text-neon-green mb-2 flex items-center justify-center gap-2">
            <span>{'>'}</span> INIT_NEW_USER
          </h1>
          <p className="text-neon-cyan/70 font-mono text-sm">
            [SYSTEM REGISTRATION]
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-terminal-bgLight/90 backdrop-blur-xl rounded border border-neon-green/40 shadow-[0_0_30px_rgba(0,255,65,0.2)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error Message */}
            {error && (
              <div className="rounded bg-neon-pink/10 p-4 border border-neon-pink/50 animate-slideInLeft shadow-[0_0_15px_rgba(255,0,110,0.3)]">
                <div className="flex items-center gap-3">
                  <span className="text-neon-pink text-xl animate-pulse">⚠</span>
                  <div className="flex-1">
                    <p className="text-sm text-neon-pink font-mono font-semibold">[REGISTRATION FAILED]</p>
                    <p className="text-xs text-neon-pink/80 font-mono mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-neon-purple/80 font-mono">
                [USER_NAME]
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-neon-purple/60">{'>'}</span>
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-terminal-bg border border-neon-purple/30 rounded focus:border-neon-purple focus:shadow-[0_0_15px_rgba(157,78,221,0.3)] transition-all text-neon-purple font-mono placeholder-neon-purple/30 focus:outline-none"
                  placeholder="user_name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-neon-cyan/80 font-mono">
                [EMAIL_ADDRESS]
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-neon-cyan/60">{'>'}</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-terminal-bg border border-neon-cyan/30 rounded focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all text-neon-cyan font-mono placeholder-neon-cyan/30 focus:outline-none"
                  placeholder="user@terminal.sys"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-neon-green/80 font-mono">
                [PASSWORD]
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-neon-green/60">{'>'}</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-12 py-3 bg-terminal-bg border border-neon-green/30 rounded focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all text-neon-green font-mono placeholder-neon-green/30 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neon-green/60 hover:text-neon-green transition-colors"
                >
                  {showPassword ? (
                    <span className="text-sm">👁️</span>
                  ) : (
                    <span className="text-sm">🔒</span>
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 animate-fadeIn">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neon-cyan/70 font-mono">[STRENGTH]</span>
                    <span className={`text-xs font-semibold font-mono ${
                      passwordStrength.strength >= 4 ? 'text-neon-green' :
                      passwordStrength.strength >= 3 ? 'text-neon-cyan' :
                      passwordStrength.strength >= 2 ? 'text-neon-yellow' :
                      'text-neon-pink'
                    }`}>
                      {passwordStrength.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-terminal-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength >= 4 ? 'bg-neon-green shadow-[0_0_10px_rgba(0,255,65,0.5)]' :
                        passwordStrength.strength >= 3 ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)]' :
                        passwordStrength.strength >= 2 ? 'bg-neon-yellow shadow-[0_0_10px_rgba(255,255,0,0.5)]' :
                        'bg-neon-pink shadow-[0_0_10px_rgba(255,0,110,0.5)]'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neon-green/80 font-mono">
                [CONFIRM_PASSWORD]
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-neon-green/60">{'>'}</span>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-terminal-bg border border-neon-green/30 rounded focus:border-neon-green focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all text-neon-green font-mono placeholder-neon-green/30 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neon-green/60 hover:text-neon-green transition-colors"
                >
                  {showConfirmPassword ? (
                    <span className="text-sm">👁️</span>
                  ) : (
                    <span className="text-sm">🔒</span>
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-neon-pink mt-1 animate-fadeIn font-mono">
                  [ERROR] Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="w-full py-3 px-4 bg-neon-purple/20 border border-neon-purple hover:bg-neon-purple/30 hover:shadow-[0_0_25px_rgba(157,78,221,0.5)] text-neon-purple font-semibold font-mono rounded disabled:bg-terminal-border/20 disabled:border-terminal-border disabled:text-neon-green/30 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <>
                  <span>{'>'} CREATE USER</span>
                  <span className="text-lg">🚀</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-neon-green/20"></div>
            <span className="px-4 text-sm text-neon-green/50 font-mono">[OR]</span>
            <div className="flex-1 border-t border-neon-green/20"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-neon-cyan/70 font-mono">
              Existing user?{" "}
              <Link
                href="/login"
                className="font-semibold text-neon-green hover:text-neon-cyan transition-colors hover:underline"
              >
                {'>'} Access terminal
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neon-green/40 mt-8 font-mono">
          [TASKMASTER_v2.0.26] © 2026
        </p>
      </div>
    </div>
  );
}
