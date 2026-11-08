"use client";

import React, { useRef, useEffect } from "react";

export interface MagneticProps {
  children: React.ReactNode;
  /** Magnetic pull strength factor (default 0.32, capped at maxOffset) */
  strength?: number;
  /** Maximum pixel displacement from origin (default 10px) */
  maxOffset?: number;
  /** Trigger padding in pixels around the element (default 24px) */
  padding?: number;
  className?: string;
}

export default function Magnetic({
  children,
  strength = 0.32,
  maxOffset = 10,
  padding = 24,
  className = "",
}: MagneticProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Disable magnetic pull on touch devices or reduced motion
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number | null = null;
    let isHovering = false;

    function tick() {
      // Smooth spring lerp damping
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      if (el) {
        el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0px)`;
      }

      // Keep ticking while moving or while returning to origin
      if (isHovering || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        animId = requestAnimationFrame(tick);
      } else {
        if (el) el.style.transform = "";
        animId = null;
      }
    }

    const startTick = () => {
      if (animId === null) {
        animId = requestAnimationFrame(tick);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      // Check if mouse is within element bounds + padding
      const isInZone =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (isInZone) {
        isHovering = true;
        // Clamp offset so button cannot jump or translate too far
        const rawX = distX * strength;
        const rawY = distY * strength;
        targetX = Math.max(-maxOffset, Math.min(maxOffset, rawX));
        targetY = Math.max(-maxOffset, Math.min(maxOffset, rawY));
        startTick();
      } else if (isHovering) {
        isHovering = false;
        targetX = 0;
        targetY = 0;
        startTick();
      }
    };

    const onMouseLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      startTick();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      if (animId !== null) cancelAnimationFrame(animId);
      if (el) el.style.transform = "";
    };
  }, [strength, maxOffset, padding]);

  return (
    <div ref={elRef} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
