import React from "react";
import Link from "next/link";

interface EduPathLogoProps {
  size?: number;
  iconOnly?: boolean;
  className?: string;
  textClassName?: string;
  href?: string;
}

export function EduPathIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="EduPath Logo"
    >
      <defs>
        <linearGradient id="ep-squircle-gradient" x1="0.1" y1="0.0" x2="0.9" y2="1.0">
          <stop offset="0%" stopColor="#755bfb" />
          <stop offset="50%" stopColor="#6d48fa" />
          <stop offset="100%" stopColor="#623bee" />
        </linearGradient>
      </defs>

      {/* Rounded Squircle Container matching reference */}
      <rect width="40" height="40" rx="11" fill="url(#ep-squircle-gradient)" />

      <g transform="translate(20, 20) scale(0.84) translate(-20, -20)">
        {/* Left Page (Solid Pure White) */}
        <path
          d="M19.5 15.1C15.5 11.8 11.2 9.5 7.6 9.2C7.2 9.2 7.0 9.5 7.0 9.9V24.5C7.0 24.9 7.3 25.2 7.7 25.2C11.3 25.6 15.5 27.8 19.5 31.4C19.8 31.6 20.0 31.4 20.0 31.1V15.5C20.0 15.2 19.8 15.0 19.5 15.1Z"
          fill="#FFFFFF"
        />

        {/* Right Page (Soft Lavender Tint for 3D page lighting) */}
        <path
          d="M20.5 15.1C24.5 11.8 28.8 9.5 32.4 9.2C32.8 9.2 33.0 9.5 33.0 9.9V24.5C33.0 24.9 32.7 25.2 32.3 25.2C28.7 25.6 24.5 27.8 20.5 31.4C20.2 31.6 20.0 31.4 20.0 31.1V15.5C20.0 15.2 20.2 15.0 20.5 15.1Z"
          fill="#C4A8FF"
        />
      </g>
    </svg>
  );
}

export default function EduPathLogo({
  size = 36,
  iconOnly = false,
  className = "",
  textClassName = "",
  href = "/",
}: EduPathLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      <div className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] rounded-[11px] shrink-0">
        <EduPathIcon size={size} />
      </div>

      {!iconOnly && (
        <span className={`font-display font-black tracking-tight text-xl sm:text-2xl text-white ${textClassName}`}>
          <span className="text-white">Edu</span>
          <span className="text-[#a855f7]">Path</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center text-decoration-none focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
