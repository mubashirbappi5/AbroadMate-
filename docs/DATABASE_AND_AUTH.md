# AbroadMate Production Database & Authentication Architecture

## 1. Overview

AbroadMate utilizes a normalized **PostgreSQL** database managed via **Prisma ORM**, coupled with **Supabase Auth** for identity management and **Supabase Storage** for private document vaulting.

This system is designed around strict ethical standards: **zero third-party data selling, zero client-trust identity extraction, and strict preservation of historical immigration policy versions**.

---

## 2. Database Models & Schema Design

The Prisma schema (`packages/database/prisma/schema.prisma`) is organized into 6 normalized domains:

### Domain 1: Authentication, Users & RBAC
- **`User`**: Core account entity. Mapped to Supabase Auth UID (`supabaseId`). Tracks email, full name, phone number, primary role, soft deletion timestamp (`deletedAt`), and active status.
- **`UserRoleAssignment`**: Relational role model supporting multi-role expansion:
  - `STUDENT`: Normal authenticated applicant.
  - `SUPER_ADMIN`: Root platform administrator.
  - `DATA_MANAGER`: Manages university catalog, program offerings, and scholarships.
  - `VERIFICATION_MANAGER`: Verifies government immigration sources and student document authenticity.
  - `SUPPORT_ADMIN`: Student advisory and community assistance.
  - `CONTENT_MANAGER`: Manages educational guides and visa articles.
- **`UserSettings`**: Language (`BN` / `EN`), default currency display (`BDT`, `GBP`, `CAD`, `EUR`, `USD`), email and in-app alert toggles.
- **`UserConsent`**: Legal audit record tracking student non-agency ethical consent, terms agreement, IP address, and user-agent.
- **`UserSessionMetadata`**: Active login session tracking (device type, browser, IP hash, last active timestamp) to power dashboard security views.

### Domain 2: Student Academic & Financial Profile
- **`StudentProfile`**: Primary student record with current academic level, target degree (Bachelor/Master/PhD), target field, target intake season and year, and profile completion meter percentage.
- **`AcademicRecord`**: Normalized secondary and tertiary records (SSC, HSC, O-Level, A-Level, Diploma, Bachelor, Master), institution name, board, GPA/CGPA, scale (4.0 or 5.0), passing year, backlogs, and transcript document links.
- **`LanguageTestRecord`**: Standardized English exam scores (IELTS, TOEFL, PTE, Duolingo, MOI) with individual band breakdowns (Listening, Reading, Writing, Speaking), TRF number, and test date.
- **`EmploymentRecord`**: Professional experience records for postgraduate applicants.
- **`FinancialProfile`**: Tuition budget amount, currency code, liquid bank balance amount, savings currency code, primary bank, and funding strategy.
- **`Sponsor`**: Family or institutional sponsors (relationship, annual income, liquid funds committed, currency code, affidavit document link).
- **`ImmigrationHistory`**: Previous visa applications, travel history, and previous visa refusals (country, year, official reason cited).
- **`StudyPreference`**: Multi-country ranking, campus type preferences, and Post-Study Work (PSW) priority.

### Domain 3: Study Abroad Reference Data
- **`Country`**: ISO-2 primary key (`GB`, `CA`, `AU`, `DE`, `US`), localized Bengali and English names, flag emoji, currency code, currency symbol, BDT exchange rate benchmark, official immigration portal URL, Dhaka embassy details, and post-study work duration.
- **`VisaType`**: Student visas (e.g. UK Student Route, Canada Study Permit, Australia Subclass 500, Germany National Visa D, US F-1), official fee amount, currency code, and processing time.
- **`University`**: Verified global institutions with QS/THE rank, city, state/province, public/private status, and official website URL.
- **`Program`**: Degree offerings, department, duration, annual tuition fee in local currency, currency code, and official course URL.
- **`AdmissionRequirement`**: Program-specific minimum CGPA, minimum IELTS overall and per-band requirement, GRE/GMAT necessity, and prerequisite subjects.
- **`Scholarship`**: Verified government, university, and trust scholarships (Chevening, Commonwealth Shared, OGS, DAAD EPOS, Australia Awards, Fulbright), coverage type, monthly stipend amount, currency code, application deadline window, and official portal link.
- **`ScholarshipEligibilityRule`**: Explicit rule constraints (minimum CGPA, allowed degree levels, eligible nationalities).
- **`FundingDecisionLog`**: Audit history tracking student funding choices ("Scholarship নিয়ে যেতে চাই" vs "নিজের খরচে যেতে চাই"), covered vs uncovered expenses in BDT, and roadmap task injection with completed task preservation.

### Domain 4: Visa Policy, Historical Versioning & Research Verification
- **`VisaRequirement`**: Parent record per country and visa subclass.
- **`VisaRequirementVersion`**: Preserves historical policy versions without overwriting older data. Tracks version number, effective start date, effective end date, changelog summary in Bengali, and official gazette URL.
- **`VisaFinancialRule`**: Required annual maintenance funds, currency code, minimum days funds must be held (e.g. UK 28-day rule), bank statement duration, acceptable financial instruments, and sponsor rules.
- **`VisaDocumentRequirement`**: Mandatory vs conditional documents (TB test certificate, Police clearance, CAS/I-20, academic transcripts, bank solvency certificates, attestation rules in Bangladesh).
- **`VisaGeneralRequirement`**: General statutory conditions (CAS, SEVIS, B2/Goethe language levels, age constraints).
- **`VisaWorkflowStep`**: Country-specific application process steps (CAS, Blocked Account, Form I-20, SEVIS, VFS Dhaka/Sylhet Biometrics, Embassy interview, arrival formalities).
- **`CountryVisaGuide`**: Comprehensive 15-section authoritative guide per country.
- **`VisaAssessmentLog`**: Audit log of student visa eligibility evaluations, verdict statuses, and financial gaps.
- **`InformationSource`**: Anti-hallucination tracking table storing official government gazettes, embassy portals, and university admission pages.
- **`SourceRecord`**: Scraped or captured official text snapshot, source URL, SHA-256 hash, and verification timestamp.
- **`SourceChangeLog`**: Automatic diff detector capturing changes on official portals requiring manual review.
- **`VerificationRecord`**: Audit entry certifying that a human Data Manager or Verification Manager confirmed the authenticity of the information.

### Domain 5: Student Activities & Roadmap Execution
- **`UserGoal`**: Student's active goals (intake, target countries, budget range, target field).
- **`Roadmap`**: Dynamic study abroad preparation pipeline.
- **`RoadmapPhase`**: The 5 structured stages (Stage 1: Early Prep & Passport, Stage 2: Tests & Documents, Stage 3: Applications, Stage 4: Visa & Solvency, Stage 5: Departure).
- **`RoadmapTask`**: Actionable milestones with checkboxes, target due dates, and direct tool links.
- **`UserDocument`**: Vault record with encrypted Supabase storage path, file category, MIME type, size, and verification flag.
- **`SOPDocument`**: Tailored Statement of Purpose drafts, university targets, AI critique history, and final version export.
- **`Deadline`**: Verified institutional and scholarship deadlines.
- **`Reminder`**: Student's custom and automated reminders (30-day, 7-day, 1-day alerts).
- **`Notification`**: Real-time in-app and email notification feed.

### Domain 6: Administration & Audit Compliance
- **`AuditLog`**: Tamper-evident logging of all administrative actions (actor UUID, action type, IP address, resource affected, before/after JSON diff, timestamp).
- **`DataReview`**: Review queue for student document verification and user-submitted data.
- **`PolicyChangeApproval`**: Two-person rule workflow for updating official visa rules or scholarship deadlines.

---

## 3. Adherence to Database Architecture Rules

1. **UUID Identifiers**: Every model uses UUID primary keys (e.g. `@id @default(uuid())`), with the exception of ISO-2 country codes (`GB`, `CA`, etc.) as standard natural keys.
2. **Proper Foreign Keys**: Foreign key constraints enforced across all relational junctions with explicit `onDelete: Cascade` or `onDelete: SetNull`.
3. **Indexes on Frequently Searched Fields**: Indexes placed on email, supabaseId, countryCode, category, degreeLevel, status, and deadline dates.
4. **Unique Constraints**: Unique constraints applied on email, supabaseId, composite pairs `(countryCode, visaCode)`, `(userId, role)`, and 1-to-1 relations.
5. **Separate Currency Codes from Monetary Amounts**: Every monetary field (`annualTuitionAmount`, `stipendMonthlyAmount`, `requiredLivingFunds`, `annualTuitionBudget`) is paired with an explicit `currencyCode` column (`GBP`, `CAD`, `BDT`, `EUR`, `USD`).
6. **Consistent Timestamps**: All entities track `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`.
7. **Preservation of Historical Visa Requirements**: Versioned immigration rules (`VisaRequirementVersion`) ensure prior years' requirements remain queryable and immutable.
8. **Soft Deletion**: `User`, `StudentProfile`, `UserDocument`, and `SOPDocument` implement `deletedAt DateTime?` for recovery and compliance.
9. **Server-Derived Identity Association**: All student records are linked to the verified `User.id` derived from server-side Supabase JWT sessions.

---

## 4. Authentication & Security Flow

```
+---------------+        +----------------------+        +-----------------------+        +-------------------+
| Next.js Client| -----> | Next.js Middleware   | -----> | Supabase SSR Verifier | -----> | PostgreSQL Prisma |
+---------------+        +----------------------+        +-----------------------+        +-------------------+
       |                            |                                |                              |
       | 1. HTTP Request            |                                |                              |
       |    (Cookies attached)      | 2. Check path (/dashboard/*)   |                              |
       |                            |    Refresh expired tokens      |                              |
       |                            | -----------------------------> | 3. Verify JWT with Secret    |
       |                            |                                |    Derive authenticated UID  |
       |                            |                                | ---------------------------> | 4. Hydrate User,
       |                            |                                |                              |    Roles & Profile
       | <------------------------- | <----------------------------- | <--------------------------- |
       | 5. Authenticated Response  |                                |                              |
```

### Endpoints
- `POST /api/auth/register`: Validates registration input with Zod, invokes Supabase Auth, creates relational records in PostgreSQL, and logs to `AuditLog`.
- `POST /api/auth/login`: Authenticates with Supabase Auth, sets HTTP-only cookies, records `UserSessionMetadata` and login audit.
- `POST /api/auth/logout`: Revokes Supabase session, clears cookies, and logs audit.
- `GET /api/auth/session`: Returns sanitized authenticated user context.

---

## 5. Private Storage & Document Security

Private storage buckets in Supabase Storage:
- `academic-documents`
- `financial-documents`
- `identity-documents`
- `language-certificates`
- `sop-files`

### Access Controls
- **Signed URL Expiration**: Time-limited to **15 minutes** (900 seconds).
- **User Data Isolation**: Students may only generate signed URLs for documents where `UserDocument.userId === authenticatedSession.user.id`.
- **MIME & File Validation**:
  - Whitelist: PDF, JPEG, PNG, DOCX.
  - Size Limit: Max 10MB per document. Executables (.exe, .sh, .bat, .js) rejected.
