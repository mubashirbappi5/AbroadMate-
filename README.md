# AbroadMate — Bengali-First AI Study Abroad Guidance Platform

> **১০০% সম্পূর্ণ ফ্রি • কোনো এজেন্সি বা দালাল ছাড়াই নিজের অ্যাপ্লিকেশন নিজে করুন**  
> *Empowering Bangladeshi students to pursue global higher education independently with verified, official guidance.*

---

## 🎯 Product Mission & Vision

**AbroadMate** is a 100% free, Bengali-first, AI-powered Study Abroad Guidance Platform built specifically for students in Bangladesh. 

In Bangladesh, students frequently encounter exploitative education consultancies that charge huge fees, falsify documents, withhold student login credentials, and steer applicants to sub-par colleges for commissions. AbroadMate provides verified, official, and personalized guidance directly to students for free.

---

## 🌍 Initial Country Coverage

- 🇬🇧 **United Kingdom** (Student Route Visa, Graduate Route 2-year PSW, 28-day financial rule)
- 🇨🇦 **Canada** (Study Permit, DLI institutions, PGWP up to 3 years)
- 🇦🇺 **Australia** (Subclass 500 Student Visa, Subclass 485 PSW, OSHC insurance)
- 🇩🇪 **Germany** (National Student Visa Type D, €11,904 Blocked Account, 18-month Job Seeker permit)
- 🇺🇸 **United States** (F-1 Visa, Form I-20, SEVIS, 12-36 months OPT/STEM OPT)

---

## 🏗️ Architecture & Technology Stack

AbroadMate is engineered as a **Modular Monolith** using a pnpm workspace monorepo:

### Technology Stack
- **Web Frontend:** Next.js 15 App Router, React 19, TypeScript (Strict Mode)
- **Design System:** Tailwind CSS, Lucide Icons, bespoke Bengali typography (`Hind Siliguri`)
- **Database & ORM:** PostgreSQL, Prisma ORM 6.x
- **Authentication & Storage:** Supabase Auth, Supabase Storage
- **Validation:** Zod schemas shared across client and server
- **Intelligence:** OpenAI API with strict anti-hallucination guardrails and source verification
- **Background Jobs:** Redis 7.x + BullMQ worker for deadline reminders and roadmap alerts
- **Testing:** Vitest (Unit & engine tests) + Playwright (End-to-End browser tests)

---

## 📂 Monorepo Structure

```
AbroadMate/
├── apps/
│   ├── web/                    # Next.js App Router Application
│   └── worker/                 # BullMQ Background Job Worker
├── packages/
│   ├── database/               # Prisma schema, client singleton, seeders
│   ├── validation/             # Shared Zod schemas (profile, eligibility, visa)
│   ├── shared/                 # Types, constants, Bengali & English i18n
│   ├── eligibility-engine/     # Deterministic admission eligibility matching logic
│   ├── scholarship-engine/     # Scholarship rules & matching logic
│   ├── visa-engine/            # Country visa funds & sponsor logic
│   ├── roadmap-engine/         # Dynamic milestone countdown timeline
│   └── ai/                     # OpenAI provider abstraction & guardrails
├── tests/
│   ├── unit/                   # Vitest unit test suite
│   └── e2e/                    # Playwright end-to-end tests
├── docs/                       # Architecture and country specifications
└── .env.example                # Documented environment variables
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- pnpm >= 9.x

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Database Setup
```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 5. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Ethical Pledge
AbroadMate does NOT sell visa guarantees, does NOT charge students fees, and does NOT accept kickbacks from third-party agents. All student-facing features remain 100% free forever.
