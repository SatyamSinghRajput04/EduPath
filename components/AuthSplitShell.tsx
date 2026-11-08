"use client";

import React from "react";
import Link from "next/link";
import { Map, Terminal, Briefcase, CheckCircle2, Cpu } from "lucide-react";
import VolumetricSmoke from "@/components/VolumetricSmoke";
import Infinity3D from "@/components/Infinity3D";
import EduPathLogo from "@/components/EduPathLogo";

interface AuthSplitShellProps {
  children: React.ReactNode;
}

const FEATURE_HIGHLIGHTS = [
  {
    icon: Map,
    title: "Personalized AI Roadmaps",
    desc: "Curated node-by-node learning sequence tailored to your target job.",
    color: "#a855f7",
  },
  {
    icon: Terminal,
    title: "AI-Powered Code Mentor",
    desc: "Real-time error explanations and milestone challenge reviews.",
    color: "#8b5cf6",
  },
  {
    icon: Briefcase,
    title: "Career & Project Tracking",
    desc: "Portfolio projects, ATS-optimized resumes, and vacancy matching.",
    color: "#06b6d4",
  },
];

export default function AuthSplitShell({ children }: AuthSplitShellProps) {
  return (
    <div className="relative w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#07070b] text-[#f0eeff] flex flex-col lg:flex-row select-none">

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT VISUAL PANEL (55% Width on Desktop)
          Immersive Brand Universe: Smoke + 3D Infinity + Mission Messaging
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex lg:w-[54%] xl:w-[56%] h-full flex-col justify-between p-8 xl:p-12 overflow-hidden bg-gradient-to-b from-[#0a0714] via-[#07070b] to-[#0a0714]">

        {/* 1. Volumetric Smoke Canvas (Calm atmospheric drift for auth) */}
        <VolumetricSmoke
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          pointerDamping={0.065}
          velocityDamping={0.080}
          maxVelocity={0.08}
          influenceRadius={0.75}
          displacementStrength={0.07}
          swirlStrength={0.30}
          idleSpeed={0.16}
          densityScale={0.82}
          scrollParallax={0}
        />

        {/* 2. Interactive 3D Glass Infinity Sculpture (Scaled to fit left panel perfectly) */}
        <Infinity3D
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          offsetX={0.0}
          offsetY={0.52}
          scaleMultiplier={0.65}
          enableScrollDissolve={false}
        />

        {/* Smooth Seamless Edge Blend (Dissolves left visual universe softly into dark workspace) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-[#07070b]/60 pointer-events-none z-[3]" />
        <div className="absolute inset-y-0 right-0 w-36 xl:w-52 bg-gradient-to-l from-[#07070b] via-[#07070b]/65 to-transparent pointer-events-none z-[3]" />

        {/* ── Top Header Brand Anchor ── */}
        <div className="relative z-10">
          <EduPathLogo size={40} href="/" textClassName="text-2xl" />
        </div>

        {/* ── Bottom Brand Showcase & Verified Feature Highlights ── */}
        <div className="relative z-10 max-w-lg space-y-6 pt-10">
          
          {/* Main Headline & Supporting Subtitle */}
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <Cpu size={13} className="text-purple-400" />
              <span>Next-Gen Engineering Platform</span>
            </div>

            <h2 className="font-display font-black text-3xl xl:text-[2.65rem] tracking-tight text-white leading-[1.14]">
              Your next chapter <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(192,132,252,0.5)]">
                starts here.
              </span>
            </h2>

            <p className="text-slate-300/85 text-sm xl:text-base leading-relaxed">
              Build verified skills, create real milestone projects, and move closer to your dream tech career with AI-powered precision.
            </p>
          </div>

          {/* Three Compact Feature Highlights */}
          <div className="space-y-2.5 pt-1">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#0f0e1a]/70 border border-white/10 backdrop-blur-md transition-all hover:border-purple-400/40 hover:bg-[#141224]/80 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border"
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: `${color}35`,
                  }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                    <span>{title}</span>
                    <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal line-clamp-1">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle Bottom Trust Label */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Trusted by 42,000+ engineers worldwide</span>
          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT AUTHENTICATION PANEL (45% Width on Desktop)
          Clean, Focused, High-Performance Authentication Interface
      ════════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full lg:w-[46%] xl:w-[44%] min-h-screen lg:h-screen flex flex-col justify-center items-center p-4 sm:p-8 lg:p-10 xl:p-14 overflow-y-auto bg-[#07070b]">

        {/* Ambient Radial Violet Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,85,247,0.12),transparent_70%)] pointer-events-none" />

        {/* Smooth Ambient Separation (Soft depth division without any hard lines or borders) */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />

        {/* Mobile / Tablet Top Branding (Visible only on < lg screens) */}
        <div className="lg:hidden mb-6 flex flex-col items-center text-center">
          <EduPathLogo size={36} href="/" textClassName="text-xl mb-1" />
          <p className="text-xs text-slate-400">Personalized learning paths from novice to senior.</p>
        </div>

        {/* Authentication Card Content Slot */}
        <div className="relative z-10 w-full max-w-[430px]">
          {children}
        </div>

        {/* Subtle Back to Home Navigation Link */}
        <div className="relative z-10 mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1.5 group text-decoration-none"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Return to EduPath Home</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
