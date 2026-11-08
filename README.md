<p align="center">
  <a href="https://github.com/SatyamSinghRajput04/EduPath">
    <img src="public/edupath-logo.svg" alt="EduPath Logo" width="280" />
  </a>
</p>

<h3 align="center">Next-Generation Engineering & AI-Powered Career Acceleration Platform</h3>

<p align="center">
  Personalized learning roadmaps, interactive 3D visualizations, AI technical mentorship, ATS-optimized portfolio engineering, and verified skill tracking—all in one unified platform.
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React 19" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License MIT" /></a>
</p>

---

## 🌟 Overview

**EduPath** is a comprehensive developer career operating system designed to guide software engineers from foundational programming to senior mastery. By combining dynamic generative learning roadmaps, real-time code and architecture coaching, interactive 3D WebGL experiences, and ATS-optimized resume tooling, EduPath bridges the gap between learning to code and landing senior roles at top technology companies.

---

## ✨ Key Features

### 🗺️ Dynamic AI Learning Roadmaps
- **Node-by-Node Sequencing**: Curated step-by-step tracks tailored to target roles (Full-Stack, Backend, Frontend, Cloud/DevOps, AI Engineering).
- **Curated Learning Resources**: Integrated documentation, milestone challenges, and estimated time-to-mastery indicators.
- **Custom Roadmap Generation**: Tailor learning paths to your exact current background, target title, and weekly schedule.

### 🌀 3D Glass Infinity & Volumetric Shader Canvas
- **Parametric 3D Infinity Knot**: Real-time glass-morphic infinity sculpture built with Three.js, procedural mesh lighting, and interactive mouse-parallax tracking.
- **Optimized Volumetric Smoke Background**: Custom forward-difference GLSL noise shader running at 60 FPS with hardware linear texture filtering and zero main-thread hitching.

### 🤖 Context-Aware AI Engineering Mentor
- **Architecture & Code Coaching**: Instant debugging assistance, clean-code advice, and milestone project review.
- **Multi-Turn Contextual Assistance**: Tailored responses based on active roadmap nodes and current student progress.
- **Interview Preparation**: Real-world behavioral, algorithm, and system-design mock guidance.

### 📄 ATS-Optimized Resume Engine
- **Live Template Preview**: Multiple battle-tested formats (Executive Modern, Minimalist Tech, Software Engineer).
- **One-Click Portfolio Sync**: Directly import verified project accomplishments and skill tags from your EduPath milestones into your resume.
- **Multi-Format Export**: Instant vector PDF generation and clean DOCX export with zero formatting degradation.
- **Real-Time ATS Scoring**: Automated heuristic evaluation assessing keyword relevance, quantitative impact, and structure.

### 🏆 Interactive Quizzes & Skill Verification
- **Milestone Assessments**: Topic-specific technical quizzes validating conceptual and hands-on comprehension.
- **Instant Explanations**: In-depth rationale provided for every question option.

### 📊 Real-Time Developer Activity Hub
- **External Stats Aggregation**: Sync profiles with **LeetCode**, **Codeforces**, and **GitHub** for a single verified developer snapshot.
- **Intelligent Job Feeds**: Match verified skill tags directly to active tech vacancies.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Actions) |
| **UI & Components** | [React 19](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [Framer Motion](https://www.framer.com/motion) |
| **3D & Graphics** | [Three.js](https://threejs.org), Custom WebGL GLSL Noise Shaders |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org), [Prisma ORM](https://www.prisma.io) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org) (Credentials Provider, OAuth Google & GitHub) |
| **Export Engines** | [jsPDF](https://github.com/parallax/jsPDF), [docx](https://docx.js.org/) |
| **Icons & Design** | [Lucide React](https://lucide.dev), Outfit Typography |

---

## 📁 Repository Structure

```text
edupath/
├── app/                        # Next.js App Router routes & layouts
│   ├── (auth)/                 # Authentication routes (login, register)
│   ├── (dashboard)/            # Authenticated user dashboard & sub-views
│   │   ├── dashboard/          # Platform overview & progress metrics
│   │   ├── mentor/             # Interactive AI Code Mentor
│   │   ├── resume/             # ATS Resume customizer & exports
│   │   └── roadmap/            # Visual learning tree & module explorer
│   ├── about/                  # Company & mission overview
│   ├── admin/                  # Administrative telemetry & user management
│   ├── api/                    # Serverless API route handlers
│   ├── contact/                # Support & feedback portal
│   ├── globals.css             # Glassmorphic dark styling & token definitions
│   ├── icon.svg                # Vector favicon
│   └── page.tsx                # Hero landing page with 3D infinity & smoke shader
├── components/                 # Reusable UI component library
│   ├── EduPathLogo.tsx         # Brand squircle book icon & two-tone wordmark
│   ├── AuthSplitShell.tsx      # Split-screen responsive authentication shell
│   ├── Infinity3D.tsx          # Three.js glass infinity sculpture
│   ├── VolumetricSmoke.tsx     # High-performance GLSL fluid smoke canvas
│   ├── Sidebar.tsx             # Collapsible glassmorphic dashboard navigation
│   ├── resume/                 # Resume templates, ATS reports, & editor cards
│   └── roadmap/                # Roadmap viewers, course cards, & quiz modules
├── lib/                        # Shared utility functions, prisma client, & prompts
├── prisma/                     # Database schema definitions & seeding scripts
│   ├── schema.prisma           # Relational schema (Users, Roadmaps, Quizzes, Resumes)
│   └── seed.mjs                # Test accounts & sample curriculum seed
└── public/                     # Static assets & brand vector resources
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.18+` or `v20+`
- **npm** or **pnpm**
- **PostgreSQL**: Running locally or via a cloud instance (e.g. Supabase, Neon)

### 1. Clone the Repository
```bash
git clone https://github.com/SatyamSinghRajput04/EduPath.git
cd EduPath
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

Configure your database and authentication secret in `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/edupath?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-random-secret"

# Optional AI Key (Groq / Llama)
GROQ_API_KEY="your-groq-api-key"
```

### 4. Initialize Database
```bash
npx prisma migrate dev
node prisma/seed.mjs
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live platform.

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with Turbopack |
| `npm run build` | Compiles optimized production build across all static/dynamic routes |
| `npm start` | Starts production server |
| `npm run lint` | Runs ESLint analysis |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [Issues](https://github.com/SatyamSinghRajput04/EduPath/issues) page or review [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<p align="center">
  <sub>Crafted with passion for learners and developers worldwide.</sub>
</p>
