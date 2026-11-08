import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduPath - Your AI-Powered Career and Learning Platform",
  description:
    "Build personalized learning roadmaps, verify skills, connect with mentors, and accelerate your tech career with EduPath.",
  keywords: ["learning", "career", "AI", "roadmap", "resume", "skills", "mentorship"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark min-h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
