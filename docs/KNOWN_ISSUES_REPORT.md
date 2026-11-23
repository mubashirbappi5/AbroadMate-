# AbroadMate - Known Issues & Operational Limitations Report

**Version:** 1.0.0-PROD  
**Date:** November 23, 2026  
**Auditor:** Senior QA & DevOps Engineering Team  
**Compliance Standard:** Strict Transparency - Only verified, implemented capabilities are claimed.

---

## 1. Documented Operational Limitations & Known Constraints

### 1.1 Currency Exchange Rate Fallback Behavior
- **Description:** Real-time exchange rate fluctuations (GBP/BDT, CAD/BDT, EUR/BDT, AUD/BDT, USD/BDT) are tracked through daily periodic background tasks. If third-party live exchange rate API keys are unconfigured or external financial endpoints experience network timeouts, AbroadMate falls back to cached statutory Bangladesh Bank benchmark exchange rates.
- **Impact:** Financial planner estimates remain consistent and statutory-compliant, but minor daily market trading fluctuations ($< \pm 1\%$) are not reflected in real-time until the next manual or scheduled catalog update.
- **Mitigation:** Administrative interface at `/dashboard/admin/jobs` allows on-demand exchange rate verification and manual rate adjustment.

### 1.2 University Course Catalog Prospectus URL Drift
- **Description:** Top universities (e.g., University of Manchester, University of Ottawa, TUM) occasionally update or relocate their program prospectus URLs during annual catalog refreshes.
- **Impact:** Prospective students clicking "Official Portal" links on older program versions may encounter 404 or redirect pages if the university alters its slug structure without notice.
- **Mitigation:** The `source-monitoring` background queue scans all catalog source URLs every 12 hours. Any URL returning non-200 HTTP responses is flagged for administrative review, notifying `DATA_MANAGER` and `VERIFICATION_MANAGER` to update the canonical link.

### 1.3 Local Development Offline Multi-Channel Delivery
- **Description:** When running locally without active SMTP credentials (`RESEND_API_KEY` or `SMTP_PASSWORD`) or a live Telegram bot token (`TELEGRAM_BOT_TOKEN`), transactional notifications operate in offline mock history mode.
- **Impact:** Dispatched emails and Telegram push messages are logged to console and in-memory history arrays rather than delivering to external inboxes.
- **Mitigation:** Offline mode ensures local automated integration tests pass reliably without triggering external network dependencies or accidental email spam. Production deployments on Railway with valid credentials perform live delivery.

### 1.4 Windows OS Filesystem Locks during Local Rebuilds
- **Description:** On Windows local development machines, concurrent Node.js processes or rapid Next.js `.next/` directory deletions can encounter transient `EPERM: operation not permitted` errors due to Windows file indexer locking.
- **Impact:** Local developers may occasionally observe a build failure when rapidly modifying files in parallel.
- **Mitigation:** Resolved by executing build commands with `pnpm.cmd --filter web build` outside file indexing locks. Production builds on Linux container environments (Vercel and Railway Docker runners) are completely unaffected.

### 1.5 Document Upload Size Limits (10 MB Ceiling)
- **Description:** Official document uploads (bank statements, academic certificates, transcripts) are capped at exactly 10 Megabytes ($10 \times 1024 \times 1024$ bytes).
- **Impact:** Uncompressed 600-DPI full-color multi-page bank statements or thesis PDFs exceeding 10 MB are rejected with a Bengali validation message.
- **Mitigation:** The upload interface instructs students to compress multi-page PDF documents or upload standard 300-DPI grayscale scans before uploading.

### 1.6 Statutory Embassy Visa Processing Fluctuations
- **Description:** The visa intelligence engine calculates visa decision windows based on published statutory embassy targets (e.g., 3-4 weeks for UK Student Visa, 6-10 weeks for Canada Study Permit, 4-8 weeks for German National Visa).
- **Impact:** Seasonal appointment surges at VFS Global Dhaka or temporary visa processing strikes cannot be dynamically predicted by historical models.
- **Mitigation:** Student roadmaps recommend initiating visa preparation at least 75-90 days prior to intake dates to accommodate unforeseen embassy delays.

---

## 2. Issue Triage & Reporting Process

For any unexpected behavioral discrepancies or policy drift observed in production:
1. Administrative staff should submit an internal report via `/dashboard/admin/sources` or `/dashboard/admin/policy-changes`.
2. Critical errors are tracked in real time via Sentry monitoring.
3. Policy corrections undergo the mandatory 9-step administrative verification workflow with side-by-side evidence comparison before publication.
