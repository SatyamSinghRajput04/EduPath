"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface HeroInteractiveTextProps {
  children?: React.ReactNode;
}

export default function HeroInteractiveText() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const descRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    if (prefersReducedMotion) return;

    let targetNormX = 0;
    let targetNormY = 0;
    let curX = 0;
    let curY = 0;
    let animId: number | null = null;
    let isVisible = true;

    function tick() {
      if (!isVisible) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now() * 0.001;

      // Snappy, responsive interpolation (0.13 lerp factor gives immediate reaction without jitter)
      curX += (targetNormX - curX) * 0.13;
      curY += (targetNormY - curY) * 0.13;

      // ── 1. Continuous Ambient Floating Waves (Desynchronized harmonics) ──
      // Words are always visibly floating in space even when cursor rests
      const floatY1 = Math.sin(now * 1.5) * 3.5;
      const floatY2 = Math.sin(now * 1.35 + 1.2) * 5.2;
      const floatY3 = Math.sin(now * 1.7 + 2.4) * 6.8;
      const floatDesc = Math.sin(now * 1.2 + 0.8) * 3.0;

      // Subtle ambient rotational breathing
      const floatTiltX = Math.sin(now * 1.1) * 0.8;
      const floatTiltY = Math.cos(now * 0.95) * 0.9;

      // ── 2. Dynamic 3D Perspective Tilt ──
      const tiltX = -curY * 4.5 + floatTiltX;
      const tiltY = curX * 6.5 + floatTiltY;

      // ── 3. High-Visibility Multi-Tier Optical Depth Parallax ──
      // Line 1: Mid-layer shift (~14px max)
      const x1 = curX * 14.0;
      const y1 = curY * 9.0 + floatY1;

      // Line 2: Prominent shift (~22px max)
      const x2 = curX * 22.0;
      const y2 = curY * 14.0 + floatY2;

      // Line 3 ("with AI Precision"): Hero foreground pop (~32px max)
      const x3 = curX * 32.0;
      const y3 = curY * 20.0 + floatY3;

      // Description: Gentle counter-parallax (~-10px) to exaggerate perceived 3D depth
      const xDesc = -curX * 10.0;
      const yDesc = -curY * 6.5 + floatDesc;

      // Apply transforms directly with zero React re-renders for steady 60 FPS
      if (line1Ref.current) {
        line1Ref.current.style.transform = `translate3d(${x1.toFixed(2)}px, ${y1.toFixed(2)}px, 15px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }
      if (line2Ref.current) {
        line2Ref.current.style.transform = `translate3d(${x2.toFixed(2)}px, ${y2.toFixed(2)}px, 30px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      }
      if (line3Ref.current) {
        line3Ref.current.style.transform = `translate3d(${x3.toFixed(2)}px, ${y3.toFixed(2)}px, 48px) rotateX(${(tiltX * 1.15).toFixed(2)}deg) rotateY(${(tiltY * 1.15).toFixed(2)}deg)`;
        // Dynamic specular shimmer position shifts with cursor movement & ambient time
        const shimmerOffset = (curX * 45.0 + 50.0 + Math.sin(now * 1.4) * 35.0).toFixed(1);
        line3Ref.current.style.backgroundPosition = `${shimmerOffset}% 50%`;
      }
      if (descRef.current) {
        descRef.current.style.transform = `translate3d(${xDesc.toFixed(2)}px, ${yDesc.toFixed(2)}px, 0px) rotateX(${(tiltX * 0.6).toFixed(2)}deg) rotateY(${(tiltY * 0.6).toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(tick);
    }

    const onMouseMove = (e: MouseEvent) => {
      // Normalized coords from -1.0 to 1.0
      targetNormX = (e.clientX / window.innerWidth) * 2 - 1;
      targetNormY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onMouseLeave = () => {
      targetNormX = 0;
      targetNormY = 0;
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
    };

    if (!isTouch) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    animId = requestAnimationFrame(tick);

    return () => {
      if (!isTouch) {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (animId !== null) cancelAnimationFrame(animId);
      if (line1Ref.current) line1Ref.current.style.transform = "";
      if (line2Ref.current) line2Ref.current.style.transform = "";
      if (line3Ref.current) line3Ref.current.style.transform = "";
      if (descRef.current) descRef.current.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="space-y-5 text-left select-none [perspective:1000px] [transform-style:preserve-3d]"
    >
      <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[2.85rem] tracking-tight text-white leading-[1.14] [transform-style:preserve-3d]">
        {/* Line 1: Launch Your */}
        <motion.span
          initial={{ opacity: 0, y: 24, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="inline-block will-change-transform"
        >
          <span
            ref={line1Ref}
            className="inline-block will-change-transform transition-colors duration-200"
          >
            Launch Your
          </span>
        </motion.span>
        <br className="hidden sm:inline" />{" "}

        {/* Line 2: Tech Career */}
        <motion.span
          initial={{ opacity: 0, y: 24, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="inline-block will-change-transform"
        >
          <span
            ref={line2Ref}
            className="inline-block will-change-transform transition-colors duration-200"
          >
            Tech Career
          </span>
        </motion.span>
        <br />

        {/* Line 3: with AI Precision (Dynamic Specular Shimmer Gradient) */}
        <motion.span
          initial={{ opacity: 0, y: 28, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          className="inline-block will-change-transform"
        >
          <span
            ref={line3Ref}
            style={{
              backgroundImage:
                "linear-gradient(115deg, #c084fc 0%, #e879f9 22%, #ffffff 48%, #e879f9 74%, #a855f7 100%)",
              backgroundSize: "240% 100%",
            }}
            className="inline-block bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(192,132,252,0.65)] will-change-transform"
          >
            with AI Precision
          </span>
        </motion.span>
      </h1>

      {/* Hero Description with Counter-Parallax Separation */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
        className="text-slate-300/85 text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md will-change-transform"
      >
        <span
          ref={descRef}
          className="inline-block will-change-transform"
        >
          Personalized AI-powered learning paths designed to accelerate your engineering journey from novice to senior.
        </span>
      </motion.p>
    </div>
  );
}
