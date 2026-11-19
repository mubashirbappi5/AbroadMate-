# AbroadMate — System Architecture & Technical Specification

**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Audience:** Engineering, Product, Architecture  

---

## 1. Executive Summary & Product Vision

**AbroadMate** is a 100% free, Bengali-first, AI-assisted Study Abroad Guidance Platform engineered specifically for Bangladeshi students. 

### Core Mission
In Bangladesh, aspiring study-abroad students routinely fall victim to unscrupulous educational consultancies that charge exorbitant processing fees, fabricate student profiles, push low-ranked commission-paying institutions, and misguide students on visa compliance. 

AbroadMate democratizes the global education journey by putting verified, official, and personalized guidance directly in students' hands.

### Guiding Principles
1. **Completely Free & Ethical:** No paywalls, no premium tiers, no credit tokens, and zero commercial agency affiliations.
2. **Bengali-First Clarity:** Default Bengali interface with standard Bangladeshi academic terminology (SSC, HSC, Honours, CGPA, IELTS, Bank Solvency, Sponsor), with seamless toggle to English.
3. **Verified Information & Official Sources:** No AI hallucinations or outdated regulations. Every university rule, visa clause, and scholarship eligibility criteria must link to an official government or institutional source URL.
4. **Extensible Modular Monolith:** Built to effortlessly support initial launch countries (UK, Canada, Australia, Germany, USA) and easily extend to Japan, Sweden, Malaysia, South Korea, and more.

---

## 2. System Domain Model & Functional Scope

The platform is partitioned into 16 decoupled domains:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                           STUDENT EXPERIENCE LAYER                        │
│   (Bengali-First Responsive Web UI, Next.js App Router, Tailwind, Radix)  │
└──────────────┬────────────────────────────────────────────┬───────────────┘
               │                                            │
┌──────────────▼────────────────────────────┐ ┌─────────────▼───────────────┐
│               CORE ENGINES                │ │       INTELLIGENCE & VAULT  │
│  - Admission Eligibility Engine           │ │  - Verified AI Assistant    │
│  - Scholarship Discovery Engine           │ │  - SOP / Motivation Builder │
│  - Visa Requirements & Checklist Engine   │ │  - Document Vault (Supabase)│
│  - Dynamic Roadmap & Deadline Scheduler   │ │  - Financial Cost Calculator│
└──────────────┬────────────────────────────┘ └─────────────┬───────────────┘
               │                                            │
┌──────────────▼────────────────────────────────────────────▼───────────────┐
│                          DATA ACCESS & INTEGRATION                        │
│   - Prisma ORM 5.x & PostgreSQL                                           │
│   - Redis 7.x & BullMQ Job Queue (Roadmap notifications, Sync worker)     │
│   - Supabase Auth (JWT, Row Level Security) & Supabase Storage            │
│   - AI Provider Abstraction (OpenAI / Fallback LLMs with Guardrails)       │
└───────────────────────────────────────────────────────────────────────────┘
```

### The 16 Core Domains:
1. **Authentication:** Supabase Auth (Email/Password, Magic Link, Google OAuth) with session management and RBAC (Student, Admin, Content Researcher).
2. **Student Profiles:** Academic records (SSC/HSC GPA, O/A Levels, Bachelor CGPA, English proficiency [IELTS/TOEFL/PTE/Duolingo], GRE/GMAT, financial budget in BDT, preferred study level, intake target).
3. **Countries:** Master data for destination countries, visa sub-classes, official immigration portals, post-study work rights (PSW), cost of living benchmarks, and language requirements.
4. **Universities:** Institutional profiles, rankings, campus locations, tuition fee ranges, partner bodies, official URLs.
5. **Academic Programs:** Degree levels (Undergraduate, Masters, PhD), intakes (Fall, Spring, Summer), course modules, credit hours, application deadlines, and tuition fees in local currency and BDT.
6. **Admission Eligibility Engine:** Deterministic rule engine parsing student GPA, academic stream (Science/Commerce/Arts), IELTS overall & per-band minimums, work experience, and prerequisite degrees.
7. **Scholarships Engine:** Catalog of government grants (DAAD, Chevening, Fulbright, Australia Awards) and institutional scholarships, matched against student merit, nationality, and financial need.
8. **Visa Requirements & Engine:** Step-by-step visa guidance, biometric requirements, financial solvency/funds proof rules (e.g., German Blocked Account, UK 28-day rule, Canadian SDS GIC, US I-20 financial declaration), official embassy links in Dhaka.
9. **Financial Planning & Cost Calculator:** Dynamic calculator computing total first-year capital needed (Tuition + Living + Health Insurance [OSHC/IHS] + Visa Fee + Airfare) converted from foreign currencies to BDT.
10. **Documents & Document Vault:** Secure document manager with templates (Statement of Purpose, Recommendation letters, Sponsor Affidavit, Bank Solvency Certificate) and file validation.
11. **Roadmaps:** Chronological study abroad journey generator with time-locked milestones based on target intake (e.g., "12 Months Before Intake", "9 Months Before Intake").
12. **Deadlines Tracker:** Personalized deadline manager with automated status tracking (Not Started, In Progress, Submitted, Accepted, Visa Lodged).
13. **AI Assistant:** Context-aware multilingual chatbot grounded in verified knowledge base entries; provides cited answers with source URLs.
14. **SOP & Motivation Letter Builder:** Guided questionnaire-based statement builder generating high-quality academic outlines and drafts without fabricating credentials.
15. **Notifications:** Email and in-app alerts for critical deadline reminders and policy changes.
16. **Administration & Research Verification:** Internal portal for researchers to ingest, review, audit, and update university, visa, and scholarship data with audit logs.

---

## 3. Technology Stack & Decision Rationale

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | **Next.js 15 (App Router)** | Server Components for optimal SEO and performance; Streaming SSR for AI responses; route groups for clean domain layout. |
| **Language & Typings** | **TypeScript 5.x (Strict)** | End-to-end type safety, strict null checks, domain DTO contracts. |
| **Styling & Design System** | **Tailwind CSS 3.4 / 4.x + Radix UI + Lucide Icons** | Accessible primitives via shadcn/ui; bespoke Bengali typography (`Hind Siliguri` / `Noto Sans Bengali`); professional Emerald green aesthetic. |
| **Data Validation** | **Zod** | Universal validation across client forms (React Hook Form) and server API endpoints. |
| **Database & ORM** | **PostgreSQL + Prisma ORM** | Relational integrity for complex foreign key relations (Universities -> Programs -> Eligibility Rules -> Sources). |
| **Authentication & Storage** | **Supabase Auth + Supabase Storage** | Production-ready auth with secure cookie handling in Next.js middleware, plus S3-compatible encrypted document storage. |
| **State & Data Fetching** | **TanStack Query (React Query) v5** | Efficient client-side caching, optimistic updates, and background revalidation. |
| **Job Queue & Cache** | **Redis + BullMQ (Dedicated Worker)** | Asynchronous processing for roadmap milestone scheduling, deadline reminder notifications, and data audit jobs. |
| **AI Provider Abstraction** | **OpenAI API + Structured Output Engine** | Decoupled client interface enabling seamless swaps (OpenAI, Gemini, Anthropic) with schema validation and citation verification. |
| **Testing** | **Vitest + Playwright** | Fast unit/integration tests for eligibility engines (Vitest) and end-to-end browser flows for student journeys (Playwright). |

---

## 4. Repository & Monorepo Structure

We employ a clean, modular pnpm workspace monorepo architecture:

```
AbroadMate/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Vitest, Lint, TypeScript check
│       └── e2e.yml                    # Playwright tests
├── apps/
│   ├── web/                           # Next.js App Router Web Application
│   │   ├── app/
│   │   │   ├── (auth)/                # Auth routes (login, register, reset-password, callback)
│   │   │   ├── (dashboard)/           # Protected student dashboard routes
│   │   │   │   ├── profile/           # Academic & personal profile builder
│   │   │   │   ├── explore/           # Countries, Universities, Programs
│   │   │   │   ├── eligibility/       # Matcher & check results
│   │   │   │   ├── scholarships/      # Scholarship catalog & recommendations
│   │   │   │   ├── visa-guides/       # Country visa requirements & checklists
│   │   │   │   ├── calculator/        # Financial cost planner
│   │   │   │   ├── documents/         # Document vault & templates
│   │   │   │   ├── sop-builder/       # AI-assisted Statement of Purpose builder
│   │   │   │   ├── roadmap/           # Personalized journey timeline
│   │   │   │   └── ai-assistant/      # Verified Q&A assistant
│   │   │   ├── (marketing)/           # Landing page, country overviews, about, disclaimer
│   │   │   ├── admin/                 # Verification & research admin interface
│   │   │   ├── api/                   # Route handlers
│   │   │   ├── layout.tsx             # Root layout with fonts, providers, i18n
│   │   │   └── globals.css            # Tailwind theme, custom font rules
│   │   ├── components/                # Shared UI primitives (buttons, modals, forms)
│   │   ├── features/                  # Domain-specific UI features (components + hooks)
│   │   ├── hooks/                     # Common hooks (useDebounce, useI18n, useAuth)
│   │   ├── lib/                       # Web utilities, API clients, Supabase browser client
│   │   └── types/                     # Web-specific view types
│   │
│   └── worker/                        # Background Job Processor (Node.js + BullMQ)
│       ├── jobs/                      # Queue definitions
│       ├── processors/                # Job handlers (deadline alerts, sync tasks)
│       ├── schedulers/                # Cron schedules
│       └── services/                  # Email & alert dispatchers
│
├── packages/
│   ├── database/                      # Prisma schema, client instance, seeders, migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Complete relational data model
│   │   │   └── seeds/                 # Curated country, university, visa, and scholarship seed data
│   │   └── src/index.ts               # Exported db client
│   │
│   ├── validation/                    # Shared Zod validation schemas
│   │   ├── src/
│   │   │   ├── profile.schema.ts      # Bangladeshi academic profile validation
│   │   │   ├── eligibility.schema.ts  # Criteria & rule schemas
│   │   │   ├── visa.schema.ts         # Visa & financial requirement schemas
│   │   │   └── ai.schema.ts           # AI prompt & response schema validation
│   │
│   ├── shared/                        # Shared constants, i18n dictionaries, types
│   │   ├── src/
│   │   │   ├── constants/             # Country codes, intake seasons, grading scales
│   │   │   ├── i18n/                  # Bengali (bn-BD) and English (en-US) dictionaries
│   │   │   ├── types/                 # Shared domain interfaces & DTOs
│   │   │   └── utils/                 # Currency conversion, GPA calculations
│   │
│   ├── eligibility-engine/            # Deterministic admission eligibility scoring
│   │   └── src/                       # Rules evaluator, band matching, prerequisites checker
│   │
│   ├── scholarship-engine/            # Scholarship qualification matching logic
│   │   └── src/                       # Scoring, nationality filters, subject mapping
│   │
│   ├── visa-engine/                   # Visa roadmap & financial proof rules
│   │   └── src/                       # Fund calculation (Blocked account, 28-day rule)
│   │
│   ├── roadmap-engine/                # Intake timeline & milestone generator
│   │   └── src/                       # Dynamic Gantt/Milestone scheduler
│   │
│   └── ai/                            # AI Provider abstraction & guardrails
│       └── src/                       # Prompt templates, citation grounder, OpenAI client
│
├── tests/
│   ├── unit/                          # Engine unit tests
│   ├── integration/                   # API & DB integration tests
│   └── e2e/                           # Playwright end-to-end tests
│
├── docs/                              # Project documentation & specs
│   ├── architecture.md
│   └── country-specs/                 # Deep dives for UK, Canada, Australia, Germany, USA
│
├── .env.example                       # Documented environment configuration
├── pnpm-workspace.yaml                # Monorepo workspace configuration
├── package.json                       # Root scripts and workspace devDependencies
├── tsconfig.json                      # Root TypeScript configuration
└── README.md
```

---

## 5. Module Dependency Diagram

```mermaid
flowchart TD
    subgraph Apps
        WEB["apps/web<br/>(Next.js App Router)"]
        WORKER["apps/worker<br/>(BullMQ Job Processor)"]
    end

    subgraph Core Packages
        DB["packages/database<br/>(Prisma & PostgreSQL)"]
        VAL["packages/validation<br/>(Zod Schemas)"]
        SHARED["packages/shared<br/>(Types, i18n, Constants)"]
    end

    subgraph Domain Engines
        EE["packages/eligibility-engine"]
        SE["packages/scholarship-engine"]
        VE["packages/visa-engine"]
        RE["packages/roadmap-engine"]
        AI["packages/ai<br/>(OpenAI Abstraction & Guardrails)"]
    end

    subgraph External Services
        SUPA_AUTH["Supabase Auth"]
        SUPA_STORAGE["Supabase Storage"]
        REDIS["Redis 7.x"]
        OPENAI["OpenAI API"]
    end

    WEB --> SHARED
    WEB --> VAL
    WEB --> DB
    WEB --> EE
    WEB --> SE
    WEB --> VE
    WEB --> RE
    WEB --> AI
    WEB --> SUPA_AUTH
    WEB --> SUPA_STORAGE

    WORKER --> DB
    WORKER --> SHARED
    WORKER --> REDIS

    EE --> SHARED
    EE --> VAL
    SE --> SHARED
    SE --> VAL
    VE --> SHARED
    VE --> VAL
    RE --> SHARED
    RE --> VAL
    AI --> SHARED
    AI --> VAL
    AI --> OPENAI

    DB --> PostgreSQL[(PostgreSQL)]
```

---

## 6. Comprehensive Database Schema Design (Prisma)

The schema enforces data integrity, official verification auditing, and domain isolation.

### Key Models:
- **`User` & `UserProfile`**: Auth mapping, contact info, language preference (`bn` or `en`).
- **`AcademicRecord`**: SSC, HSC, Honours/BSc with Bangladeshi GPA, passing year, group/major, medium of instruction.
- **`EnglishTestScore`**: Test type (IELTS, TOEFL, PTE, Duolingo), overall score, listening, reading, writing, speaking scores, test date.
- **`StandardizedTestScore`**: GRE, GMAT, SAT scores.
- **`Country`**: ISO code, English name, Bengali name, currency, official immigration portal URL, post-study work permit duration, min living expense estimate in BDT.
- **`University`**: Country relation, English name, Bengali name, city, world ranking, website URL, accreditation.
- **`Program`**: Degree level, department, tuition fee currency, tuition amount, duration in months, work-placement option.
- **`ProgramIntake`**: Intake season (Fall/Spring/Summer), application open date, application deadline, session start date.
- **`ProgramRequirement`**: Minimum GPA requirement, minimum English test requirement (overall & each band), prerequisite background, GRE required flag.
- **`Scholarship`**: Name (EN/BN), provider type (Government, University, Trust), coverage (Full Ride, Tuition Waiver, Monthly Stipend), eligibility rules, deadline, official portal URL.
- **`VisaRequirement`**: Country code, visa category (e.g., F-1, Student Route, Subclass 500, National Visa Type D), financial proof formula, minimum required funds, sponsor restrictions, biometrics steps, official embassy link.
- **`StudentRoadmap`**: User relation, target country, target intake, status, created at.
- **`RoadmapMilestone`**: Stage, title (EN/BN), description, target completion date, is_completed flag, official action link.
- **`DocumentTemplate` & `UserDocument`**: SOP, CV, Bank Solvency certificate guidance with secure Supabase storage reference.
- **`InformationSource`**: Source verification table with source URL, authority name, verification timestamp, researcher ID, and freshness status.

---

## 7. Bengali-First Localization & Typography Strategy

Bangladeshi students need clear, culturally appropriate language without confusing bureaucratic jargon:

1. **Default Locale:** `bn-BD` (Bengali). Users can switch to `en-US` with a single click.
2. **Typography:**
   - Primary Bengali font: `Hind Siliguri` (Google Font with optimal kerning for Bengali glyphs) and `Noto Sans Bengali`.
   - Primary Latin font: `Inter` or `Geist`.
3. **Term Translation Standard:**
   - SSC/HSC GPA: "এসএসসি / এইচএসসি জিপিএ"
   - Bank Solvency: "ব্যাংক সলভেন্সি ও আর্থিক প্রমাণপত্র"
   - Statement of Purpose: "স্টেটমেন্ট অব পারপাস (SOP)"
   - Blocked Account (Germany): "ব্লকড অ্যাকাউন্ট"
   - Post-Study Work: "পড়াশোনা পরবর্তী কাজের সুযোগ (PSW)"
   - Living Expenses: "মাসিক ও বাৎসরিক জীবনযাত্রার ব্যয়"

---

## 8. Verified AI Assistant & Guardrail System

The AI Assistant is strictly anchored to avoid misleading vulnerable students:
1. **Source Grounding:** AI queries query the curated PostgreSQL knowledge base of official requirements.
2. **System Prompt Guardrails:**
   - Explicitly rejects inventing admission guarantees or visa issuance guarantees.
   - Clarifies that visa approval is at the sole discretion of the respective embassy/high commission.
   - Quotes monetary figures in both local currency (GBP, USD, EUR, AUD, CAD) and approximate Bangladeshi Taka (BDT).
   - Informs students about common consultancy scams in Bangladesh (e.g., "Package Offers", "No-visa-no-fee guarantee", "Fake bank certificate traps").

---

## 9. Environment Variables Specification

The system specifies distinct environment configurations with strict Zod validation:

```env
# ==============================================================================
# AbroadMate - Environment Configuration
# ==============================================================================

# Application
NODE_ENV="development"
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="AbroadMate"
NEXT_PUBLIC_DEFAULT_LOCALE="bn"

# PostgreSQL Database (Direct & Pooled Connection)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/abroadmate?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/abroadmate?schema=public"

# Supabase Auth & Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET_DOCUMENTS="student-documents"

# Redis & BullMQ
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_TLS=false

# AI Services
OPENAI_API_KEY="sk-mock-or-actual-key"
OPENAI_MODEL="gpt-4o"
AI_MAX_TOKENS=2000

# Security & Sessions
NEXTAUTH_SECRET="super-secret-random-hex-string-for-session-signing-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Currency Exchange Rates API (Optional Fallback to Cached Rates)
EXCHANGE_RATE_API_KEY=""
```

---

## 10. Technical Risks & Mitigation Strategies

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Immigration Rules Drift** (UK/Canada changing work caps, Germany increasing blocked account amount) | High | All visa and financial rules are stored in database records tied to `InformationSource` URLs with automated 30-day review flags rather than hardcoded in React code. |
| **Bengali Text Rendering & Font Layout Shifts** | Medium | Integrated Google Fonts (`Hind Siliguri` & `Inter`) using `next/font` with font-display swap, zero CLS, and carefully styled line-height for Bengali conjuncts. |
| **Bangladeshi Grading System Discrepancies** | Medium | Built-in conversion rules handling national board GPA (scale of 5.00), English medium (O/A Levels), and university CGPA (scale of 4.00) with detailed grade breakdown forms. |
| **AI Hallucinations on Visa/Scholarship Info** | Critical | RAG-based context injection with strict instructions to output official citations or state "তথ্যটি যাচাইকৃত নয়" (information not verified) when uncertain. |
| **Free-Tier Sustainability & Load Spikes** | Low | Next.js Server Components, Static Generation for country guides, and lightweight serverless queries with PostgreSQL connection pooling. |

---

## 11. Phased Development Roadmap

- **Phase 1 (Current Step):** Foundation Architecture, Monorepo Setup, Design System, Responsive Shell, Bengali/English Localization primitives, Environment Configuration.
- **Phase 2:** Database Domain Models, Prisma Migrations, Master Country Data Seeders (UK, Canada, Australia, Germany, USA).
- **Phase 3:** Student Academic Profile Builder (Bangladeshi GPA/English Test parsing).
- **Phase 4:** Eligibility & Scholarship Matching Engines.
- **Phase 5:** Visa Requirements, Document Checklist & Dynamic Cost Calculator.
- **Phase 6:** AI Assistant & Guided SOP/Motivation Letter Generator.
- **Phase 7:** Personalized Roadmap & Deadline Tracking.
- **Phase 8:** Testing (Vitest, Playwright), Security Audit, and Production Polish.
