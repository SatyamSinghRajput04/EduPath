"use client";

import Link from "next/link";
import VolumetricSmoke from "@/components/VolumetricSmoke";
import Infinity3D from "@/components/Infinity3D";
import Magnetic from "@/components/Magnetic";
import HeroInteractiveText from "@/components/HeroInteractiveText";
import EduPathLogo from "@/components/EduPathLogo";
import {
  Zap,
  ArrowRight,
  Star,
  ChevronDown,
  Terminal,
  FileText,
  Briefcase,
  Map,
  Sparkles,
  CheckCircle2,
  Code2,
  Users,
} from "lucide-react";

/* ── Platform Data ────────────────────────────────────────────────────────── */
const STATS = [
  { label: "Active Learners", value: "42,800+", icon: Users, color: "#a855f7" },
  { label: "Roadmaps Generated", value: "186,000+", icon: Map, color: "#8b5cf6" },
  { label: "Projects Built", value: "94,200+", icon: Code2, color: "#06b6d4" },
  { label: "Tech Jobs Landed", value: "8,700+", icon: Briefcase, color: "#10b981" },
];

const STEPS = [
  { num: "01", title: "Set Your Target Goal", desc: "Select your dream tech role, current skill baseline, and weekly availability." },
  { num: "02", title: "Get Your AI Roadmap", desc: "Receive an adaptive, step-by-step curriculum with hands-on milestone projects." },
  { num: "03", title: "Build & Verify Skills", desc: "Solve real-world challenges, take skill quizzes, and track LeetCode & GitHub stats." },
  { num: "04", title: "Get Hired Faster", desc: "Generate ATS-optimized resumes and match directly with live developer vacancies." },
];

const REVIEWS = [
  { name: "Sarah K.", role: "Frontend Engineer @ Meta", quote: "EduPath's AI roadmap took me from basic JavaScript to landing my dream role in 7 months. The milestone reviews were game-changing.", avatar: "SK", color: "#a855f7" },
  { name: "Alex R.", role: "Machine Learning @ Google", quote: "The resume ATS optimization tool caught syntax flaws that had filtered me out for a year. Got 3 interviews in my first week.", avatar: "AR", color: "#8b5cf6" },
  { name: "Priya M.", role: "Full-Stack Dev @ Fintech", quote: "Having an AI pair programmer alongside real curated roadmaps kept me accountable every single evening. 100% recommended.", avatar: "PM", color: "#06b6d4" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#07070b] text-[#f0eeff] font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════
          PERSISTENT FULL-PAGE ATMOSPHERIC VOLUMETRIC SMOKE BACKGROUND
          Single persistent WebGL canvas fixed to viewport behind all sections
      ════════════════════════════════════════════════════════════════════ */}
      <VolumetricSmoke
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        pointerDamping={0.065}
        velocityDamping={0.080}
        maxVelocity={0.10}
        influenceRadius={0.80}
        displacementStrength={0.095}
        swirlStrength={0.40}
        idleSpeed={0.30}
        densityScale={1.0}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          INTERACTIVE 3D GLASS INFINITY SCULPTURE (Three.js WebGL)
          Persistent viewport-fixed 3D sculpture with scroll-driven choreography
      ════════════════════════════════════════════════════════════════════ */}
      <Infinity3D className="fixed inset-0 w-full h-full pointer-events-none z-[2]" />

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO SECTION (Full Viewport Immersion & Consistent Alignment)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-between bg-transparent z-10">

        {/* Ambient Contrast Gradient for Left-Side Typography */}
        <div className="absolute inset-y-0 left-0 w-full max-w-2xl bg-gradient-to-r from-[#07070b]/95 via-[#07070b]/60 to-transparent pointer-events-none z-[1]" />

        {/* ── Top Header (Clean Floating Logo on Left & Actions on Top-Right) ── */}
        <header className="relative z-20 pt-6 sm:pt-8 w-full px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
          {/* Logo */}
          <EduPathLogo size={38} href="/" />

          {/* Auth Actions (Login + Get Started Free pushed to Top-Right) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            <Link
              href="/login"
              className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap group/login"
            >
              <span>Log In</span>
              <span className="absolute bottom-1 left-3 right-3 h-[1.5px] bg-purple-400/80 scale-x-0 group-hover/login:scale-x-100 transition-transform duration-200 origin-center" />
            </Link>
            <Magnetic strength={0.25} maxOffset={8} padding={20}>
              <Link
                href="/register"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 hover:opacity-95 shadow-[0_0_18px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap inline-flex items-center"
              >
                Get Started Free
              </Link>
            </Magnetic>
          </div>
        </header>

        {/* ── Hero Left-Side Typography & Compact Purple CTAs (Shifted Left) ── */}
        <div className="relative z-20 w-full px-6 sm:px-10 lg:px-14 xl:px-16 my-auto py-10 sm:py-14">
          <div className="max-w-md lg:max-w-lg space-y-5 text-left">
            {/* Interactive Hero Typography with subtle cursor parallax & entrance reveals */}
            <HeroInteractiveText />

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-3.5 pt-2">
              <Magnetic strength={0.32} maxOffset={12} padding={28}>
                <Link
                  href="/roadmap"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 hover:opacity-95 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 whitespace-nowrap group/cta"
                >
                  <span>Generate My Roadmap</span>
                  <ArrowRight size={15} className="shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1" />
                </Link>
              </Magnetic>

              <Magnetic strength={0.28} maxOffset={10} padding={24}>
                <Link
                  href="/dashboard"
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 backdrop-blur-md transition-all hover:border-purple-400/40 hover:scale-[1.02] whitespace-nowrap inline-flex items-center"
                >
                  View Dashboard
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* ── Scroll Cue Indicator (Leads to Scrolled Content) ── */}
        <div className="relative z-20 pb-6 flex justify-center">
          <a
            href="#overview"
            className="flex flex-col items-center gap-1.5 text-slate-400/70 hover:text-purple-300 transition-colors group text-decoration-none"
          >
            <span className="text-[10px] font-semibold tracking-widest uppercase">Explore Platform</span>
            <div className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center group-hover:border-purple-400 group-hover:bg-purple-500/10 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all animate-bounce">
              <ChevronDown size={14} className="text-purple-400" />
            </div>
          </a>
        </div>

      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. SECTION A — LIVE STATS STRIP
      ════════════════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 scroll-mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 p-5 sm:p-8 rounded-2xl bg-[#0f0f18]/80 backdrop-blur-xl border border-purple-500/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center text-center p-2 sm:p-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                <Icon size={18} style={{ color }} />
              </div>
              <div className="font-display font-extrabold text-xl sm:text-3xl text-white tracking-tight">{value}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. SECTION B — FEATURE BENTO GRID (Core AI Tools)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Everything You Need to Go <br />
            <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
              From Beginner to Hired
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            One cohesive AI-powered ecosystem combining adaptive roadmaps, pair programming, ATS resumes, and live jobs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: AI Roadmap Generator */}
          <div className="rounded-3xl bg-[#11111c]/85 backdrop-blur-md border border-white/10 hover:border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.18)] group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                <Map size={20} className="text-purple-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Adaptive AI Roadmap Generator</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Tell the AI your target job and weekly hours. It generates an intelligent, node-by-node learning sequence tailored to you.
              </p>
            </div>

            <div className="bg-[#0b0b12] rounded-xl p-4 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-purple-300 font-semibold pb-1 border-b border-white/5">
                <span>Frontend to Full-Stack Engineer</span>
                <span className="text-emerald-400">72% Completed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <div className="px-2.5 sm:px-3 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[11px] text-purple-200 flex items-center justify-center gap-1.5 font-medium min-w-0">
                  <CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> <span className="truncate">Core JS & DOM</span>
                </div>
                <div className="px-2.5 sm:px-3 py-2 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[11px] text-purple-200 flex items-center justify-center gap-1.5 font-medium min-w-0">
                  <CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> <span className="truncate">React & Next.js</span>
                </div>
                <div className="px-2.5 sm:px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20 text-[11px] text-slate-300 flex items-center justify-center gap-1.5 font-medium min-w-0">
                  <Sparkles size={12} className="text-purple-400 shrink-0 animate-pulse" /> <span className="truncate">Full Stack Node</span>
                </div>
              </div>
            </div>

            <Link href="/roadmap" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              Generate Your Roadmap <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 2: AI Code Mentor */}
          <div className="rounded-3xl bg-[#11111c]/85 backdrop-blur-md border border-white/10 hover:border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.18)] group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                <Terminal size={20} className="text-violet-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">24/7 AI Code Mentor</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Powered by high-speed Groq AI. Get instant syntax explanations, code reviews, and algorithmic optimization.
              </p>
            </div>

            <div className="bg-[#0b0b12] rounded-xl p-3.5 border border-white/5 font-mono text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 pb-2 text-[10px] text-slate-500 border-b border-white/5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="ml-2 text-slate-400">mentor-terminal.ts</span>
              </div>
              <p className="text-purple-400 text-[11px] font-semibold">// AI Feedback (Groq Llama):</p>
              <p className="text-slate-400 text-[11px] leading-snug">
                &ldquo;Reduced time complexity from O(n²) to O(n) using a hash map lookup.&rdquo;
              </p>
            </div>

            <Link href="/mentor" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              Chat With Mentor <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 3: ATS Resume Builder */}
          <div className="rounded-3xl bg-[#11111c]/85 backdrop-blur-md border border-white/10 hover:border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.18)] group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
                <FileText size={20} className="text-cyan-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">ATS-Optimized Resumes</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Rewrite bullet points with high-impact action verbs and export verified resumes that beat corporate filters.
              </p>
            </div>

            <div className="bg-[#0b0b12] rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">ATS Match Rating</div>
                <div className="font-bold text-base text-white">96 / 100 · Excellent</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Verified
              </span>
            </div>

            <Link href="/resume" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              Build Your Resume <ArrowRight size={13} />
            </Link>
          </div>

          {/* Card 4: Curated Live Job Board */}
          <div className="rounded-3xl bg-[#11111c]/85 backdrop-blur-md border border-white/10 hover:border-purple-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.18)] group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                <Briefcase size={20} className="text-emerald-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Live Job Board & Pipeline</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Connected with real-time job feeds. Matches openings directly to the verified skills on your EduPath profile.
              </p>
            </div>

            <div className="bg-[#0b0b12] rounded-xl p-4 border border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 min-w-0">
                <div className="font-bold text-purple-300 text-sm sm:text-base">12</div>
                <div className="text-[10px] text-slate-400 truncate">Matched Jobs</div>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 min-w-0">
                <div className="font-bold text-cyan-300 text-sm sm:text-base">4</div>
                <div className="text-[10px] text-slate-400 truncate">Applications</div>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 min-w-0">
                <div className="font-bold text-emerald-300 text-sm sm:text-base">2</div>
                <div className="text-[10px] text-slate-400 truncate">Interviews</div>
              </div>
            </div>

            <Link href="/jobs" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              Explore Live Jobs <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. SECTION C — 4-STEP CAREER PIPELINE ("How It Works")
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-2">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Your Path From <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">Zero to Hired</span>
          </h2>
          <p className="text-slate-300 text-sm drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">A guided, verified framework engineered for rapid career transition.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ num, title, desc }) => (
            <div key={num} className="p-6 rounded-2xl bg-[#0f0f18]/85 backdrop-blur-md border border-white/10 hover:border-purple-500/40 transition-all hover:-translate-y-1">
              <span className="font-mono text-2xl font-black text-purple-400/80">{num}</span>
              <h3 className="font-display font-bold text-lg text-white mt-3 mb-2">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. SECTION D — WALL OF LOVE (Developer Testimonials)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14 space-y-2">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Loved by Developers Worldwide
          </h2>
          <p className="text-slate-300 text-sm drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">Real stories from engineers who leveled up their career with EduPath.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(({ name, role, quote, avatar, color }) => (
            <div key={name} className="p-6 rounded-2xl bg-[#0f0f18]/85 backdrop-blur-md border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
              </div>
              
              <div className="flex items-center gap-3 pt-6 border-t border-white/5 mt-6">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white"
                  style={{ background: `linear-gradient(135deg, ${color}, #6366f1)` }}
                >
                  {avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{name}</div>
                  <div className="text-[11px] text-slate-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. SECTION E — FINAL HIGH-IMPACT CTA & FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center bg-gradient-to-b from-purple-900/30 to-[#0b0b14] border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
          <div className="absolute inset-0 bg-radial from-purple-500/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Ready to Accelerate Your Career <br />
              <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                with AI Precision?
              </span>
            </h2>
            <p className="text-slate-200 text-sm max-w-md mx-auto drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
              Join 42,000+ developers building their personalized roadmaps and landing tech roles today.
            </p>
            
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="px-6 sm:px-7 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-600 shadow-[0_0_24px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/roadmap"
                className="px-5 sm:px-6 py-3 rounded-full text-sm font-medium text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-purple-400/40"
              >
                Explore Roadmaps
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-20 border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
          <EduPathLogo size={22} textClassName="text-sm font-bold" href="/" />
          <span className="text-slate-400">— Built for learners everywhere.</span>
        </div>
        <div>
          © {new Date().getFullYear()} EduPath. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
