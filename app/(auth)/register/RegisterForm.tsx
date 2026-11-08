"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.error ?? "Unable to create account. Please try again.");
        setPending(false);
        return;
      }

      setSuccess(true);

      // Automatically sign in the user and navigate straight to the dashboard
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        // Fallback in case automated sign-in fails
        router.push("/login?registered=true");
        return;
      }

      window.location.href = signInResult?.url ?? "/dashboard";
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-[#0f0e1a]/90 backdrop-blur-2xl border border-purple-500/20 shadow-[0_24px_64px_rgba(0,0,0,0.65),0_0_35px_rgba(168,85,247,0.12)] p-7 sm:p-9 overflow-hidden">
      
      {/* Ambient Top-Right Radial Glow */}
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Form Header ── */}
      <div className="relative z-10 mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold mb-2">
          <Sparkles size={11} className="text-purple-400" />
          <span>Get Started Free</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Join 42,000+ developers accelerating their career with AI precision.
        </p>
      </div>

      {success ? (
        <div className="relative z-10 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-center space-y-3 animate-fadeIn my-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-base text-white">Account Created Successfully!</h3>
          <p className="text-xs text-emerald-300/80">
            Signing you in and loading your dashboard…
          </p>
          <div className="flex justify-center pt-1">
            <span className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="relative z-10 space-y-3.5">
          
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Full Name
            </label>
            <div className="relative rounded-xl bg-[#131221]/80 border border-white/10 hover:border-purple-400/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all flex items-center">
              <div className="pl-3.5 text-slate-400 pointer-events-none">
                <User size={16} />
              </div>
              <input
                type="text"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-[#f0eeff] placeholder-slate-500 focus:outline-none"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email Address */}
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
                className="w-full bg-transparent px-3 py-2.5 text-sm text-[#f0eeff] placeholder-slate-500 focus:outline-none"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Password
            </label>
            <div className="relative rounded-xl bg-[#131221]/80 border border-white/10 hover:border-purple-400/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all flex items-center">
              <div className="pl-3.5 text-slate-400 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-[#f0eeff] placeholder-slate-500 focus:outline-none pr-10"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              Confirm Password
            </label>
            <div className="relative rounded-xl bg-[#131221]/80 border border-white/10 hover:border-purple-400/40 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all flex items-center">
              <div className="pl-3.5 text-slate-400 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full bg-transparent px-3 py-2.5 text-sm text-[#f0eeff] placeholder-slate-500 focus:outline-none pr-10"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 text-slate-400 hover:text-purple-300 transition-colors p-1"
                onClick={() => setShowConfirm(!showConfirm)}
                title={showConfirm ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
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
                Creating account…
              </span>
            ) : (
              <>
                <span>Sign Up Free</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}

      {/* ── Switch to Login ── */}
      <div className="relative z-10 text-center mt-5 pt-4 border-t border-white/5">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-purple-400 hover:text-purple-300 transition-colors ml-1"
          >
            Log in
          </Link>
        </p>
      </div>

    </div>
  );
}
