"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

type LoginFormProps = {
  oauthProviders: { google: boolean; github: boolean };
};

export default function LoginForm({ oauthProviders }: LoginFormProps) {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    setPending(true);
    try {
      const healthRes = await fetch("/api/health/db").catch(() => null);
      if (!healthRes?.ok) {
        setError("Database unavailable. Please ensure PostgreSQL is running on localhost:5432.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Invalid email or password. Please verify your credentials or try again.");
        return;
      }

      window.location.href = result?.url ?? "/dashboard";
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-[#0f0e1a]/90 backdrop-blur-2xl border border-purple-500/20 shadow-[0_24px_64px_rgba(0,0,0,0.65),0_0_35px_rgba(168,85,247,0.12)] p-7 sm:p-9 overflow-hidden">
      
      {/* Ambient Top-Right Radial Glow */}
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Form Header ── */}
      <div className="relative z-10 mb-7">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold mb-2">
          <Sparkles size={11} className="text-purple-400" />
          <span>Welcome Back</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          Log In
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Enter your credentials to continue your AI engineering journey.
        </p>
      </div>

      {/* ── Main Form ── */}
      <form onSubmit={handleLogin} className="relative z-10 space-y-4">
        
        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-slate-300 tracking-wide block">
            Email Address
          </label>
          <div className="relative rounded-xl bg-[#131221]/80 border border-white/10 hover:border-purple-400/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all flex items-center">
            <div className="pl-3.5 text-slate-400 pointer-events-none">
              <Mail size={16} />
            </div>
            <input
              type="email"
              className="w-full bg-transparent px-3 py-3 text-sm text-[#f0eeff] placeholder-slate-500 focus:outline-none"
              placeholder="example123@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 tracking-wide">
              Password
            </label>
            <Link
              href="/register"
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative rounded-xl bg-[#131221]/80 border border-white/10 hover:border-purple-400/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all flex items-center">
            <div className="pl-3.5 text-slate-400 pointer-events-none">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-transparent px-3 py-3 text-sm text-[#f0eeff] placeholder-slate-500 focus:outline-none pr-10"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 text-slate-400 hover:text-purple-300 transition-colors p-1"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs p-3 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full mt-2 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 hover:opacity-95 shadow-[0_0_24px_rgba(168,85,247,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* ── Switch to Register ── */}
      <div className="relative z-10 text-center mt-5 pt-4 border-t border-white/5">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-purple-400 hover:text-purple-300 transition-colors ml-1"
          >
            Sign up free
          </Link>
        </p>
      </div>

      {/* ── Social / OAuth Providers (if enabled) ── */}
      {(oauthProviders.google || oauthProviders.github) && (
        <div className="relative z-10 mt-5 pt-4 border-t border-white/5">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest text-center mb-3">
            Or continue with
          </p>
          <div className="flex gap-2.5 justify-center">
            {oauthProviders.google && (
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-purple-400/40 hover:bg-white/[0.08] text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            )}
            {oauthProviders.github && (
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-purple-400/40 hover:bg-white/[0.08] text-xs font-semibold text-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
