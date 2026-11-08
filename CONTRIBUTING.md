# Contributing to EduPath

Thank you for your interest in contributing to **EduPath**! We welcome contributions from developers of all skill levels.

---

## 🛠️ Development Setup

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/SatyamSinghRajput04/EduPath.git
   cd EduPath
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env.local` and configure your PostgreSQL database connection:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize Database**:
   ```bash
   npx prisma migrate dev
   node prisma/seed.mjs
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📋 Contribution Guidelines

- **Branch Naming**: Use descriptive branch names like `feature/roadmap-filters` or `fix/auth-redirect`.
- **Code Quality**: Ensure TypeScript compiles cleanly without errors (`npm run build`).
- **Styling**: Adhere to Tailwind CSS utility conventions and dark-mode styling variables.
- **Commit Messages**: Follow standard conventional commits format (e.g., `feat: add interactive milestone checklist`, `fix: resolve mobile navigation backdrop`).

---

## 📜 Code of Conduct

Be welcoming, inclusive, respectful, and collaborative. We are building EduPath to help developers everywhere accelerate their growth.
