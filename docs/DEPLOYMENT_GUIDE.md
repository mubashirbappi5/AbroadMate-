# AbroadMate - Production Deployment Guide

**Target Environment:** Production  
**Platforms:** Vercel (Frontend & Serverless APIs), Railway (BullMQ Async Worker), Supabase (PostgreSQL & Storage), Upstash (Redis)  
**Primary Region:** Singapore (`sin1` / `ap-southeast-1` - Optimized for Bangladesh latency)

---

## 1. Prerequisites & Required Accounts

Before beginning deployment, ensure you have active accounts on:
1. **GitHub:** Repository access (`AbroadMate AI`).
2. **Vercel:** Enterprise / Pro account for Next.js hosting.
3. **Supabase:** Managed PostgreSQL database, Auth, and Storage.
4. **Upstash / Managed Redis:** Redis cluster with TLS support.
5. **Railway / Container Host:** For persistent background worker execution.
6. **OpenAI Platform:** API key with access to `gpt-4o`.
7. **Resend / SendGrid / Postmark:** For transactional email delivery.

---

## 2. Phase 1: Database & Storage Provisioning (Supabase)

### Step 1: Create Supabase Project
1. Log in to [Supabase](https://supabase.com) and create a new project:
   - **Name:** `AbroadMate-Production`
   - **Region:** `Southeast Asia (Singapore) - ap-southeast-1`
   - **Database Password:** Generate a high-entropy 32-character password.

### Step 2: Configure Connection Pooling (PgBouncer)
1. Navigate to **Project Settings** $\to$ **Database** $\to$ **Connection string**.
2. Note both connection strings:
   - **Transaction Mode (Pooled - Port 6543):** Set as `DATABASE_URL` for Next.js Serverless runtime.
   - **Session Mode (Direct - Port 5432):** Set as `DIRECT_URL` for Prisma migrations and long-running workers.

### Step 3: Run Database Migrations & Seeds
Execute migrations from your development machine or CI pipeline:
```bash
# Push production schema to Supabase PostgreSQL
DIRECT_URL="postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres" \
DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true" \
pnpm --filter @abroadmate/database db:push

# Seed official catalog data (Universities, Programs, Scholarships, Visa Rules)
pnpm --filter @abroadmate/database db:seed
```

### Step 4: Configure Storage Bucket
1. Go to **Storage** $\to$ **New Bucket**.
2. **Name:** `student-documents`
3. **Public bucket:** Toggle **OFF** (Must be strictly private).
4. **Allowed MIME types:** `application/pdf, image/jpeg, image/png, application/vnd.openxmlformats-officedocument.wordprocessingml.document`
5. **Max file size:** `10 MB`

---

## 3. Phase 2: Redis Provisioning (Upstash)

1. Log in to [Upstash Console](https://console.upstash.com).
2. Create a Redis database:
   - **Name:** `abroadmate-bullmq-prod`
   - **Region:** `ap-southeast-1` (Singapore)
   - **TLS:** **Enabled**
   - **Eviction Policy:** `noeviction` (Mandatory for BullMQ reliability)
3. Copy the Host, Port, and Password credentials.

---

## 4. Phase 3: Web Application Deployment (Vercel)

### Step 1: Import Project
1. Open [Vercel Dashboard](https://vercel.com) $\to$ **Add New** $\to$ **Project**.
2. Select the `AbroadMate AI` GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `./`
   - **Build Command:** `pnpm --filter @abroadmate/web build`
   - **Install Command:** `pnpm install`

### Step 2: Configure Environment Variables
Add all production environment variables specified in `docs/ENVIRONMENT_VARIABLE_GUIDE.md`:
- `DATABASE_URL` (Pooled)
- `DIRECT_URL` (Direct)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `NEXT_PUBLIC_APP_URL` (`https://abroadmate.ai`)

### Step 3: Deploy & Verify Custom Domain
1. Click **Deploy**. Vercel will compile all 111 static and dynamic routes.
2. Under **Settings** $\to$ **Domains**, add `abroadmate.ai` and configure DNS records (A record pointing to `76.76.21.21`).

---

## 5. Phase 4: Background Worker Deployment (Railway)

The background worker in `apps/worker` runs as a persistent service processing the 8 BullMQ queues and cron jobs.

### Step 1: Create Railway Project
1. Log in to [Railway](https://railway.app) $\to$ **New Project** $\to$ **Deploy from GitHub repo**.
2. Select the `AbroadMate AI` repository.

### Step 2: Configure Build & Start
1. Under **Settings** $\to$ **Build**:
   - **Builder:** `DOCKERFILE`
   - **Dockerfile Path:** `apps/worker/Dockerfile`
2. Under **Settings** $\to$ **Deploy**:
   - **Restart Policy:** `On Failure` (Max Retries: 10)

### Step 3: Set Worker Environment Variables
Set the following variables in Railway:
- `DIRECT_URL` (Direct PostgreSQL connection for worker persistence)
- `DATABASE_URL` (Direct or Pooled)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS`
- `OPENAI_API_KEY`
- `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `TELEGRAM_BOT_TOKEN`
- `NODE_ENV="production"`

### Step 4: Verify Worker Startup
Inspect the deployment logs to confirm that all 8 queues initialize:
```log
[Worker] Initializing 8 BullMQ queues on Redis...
[Worker] Registered cron: 6h deadline scan (0 */6 * * *)
[Worker] Registered cron: 12h source monitoring (0 */12 * * *)
[Worker] Registered cron: 24h periodic data verification (0 0 * * *)
[Worker] All workers active and listening for jobs.
```

---

## 6. Phase 5: Post-Deployment Smoke Testing

Perform the following verification checks on the live production environment:

1. **Static Route Delivery:** Visit `https://abroadmate.ai/explore` and `https://abroadmate.ai/universities` - ensure sub-200ms TTFB.
2. **Student Registration Flow:** Register a new test account at `/register` - verify ethical consent requirement and onboarding wizard redirect.
3. **Deterministic Engine:** Run an admission assessment for University of Manchester at `/dashboard/eligibility` - verify reproducible verdict.
4. **Visa Solvency Calculator:** Calculate UK 28-day funds at `/dashboard/calculator` - verify accurate BDT conversion.
5. **Background Jobs Console:** Log in as `SUPER_ADMIN` and navigate to `/dashboard/admin/jobs` - trigger a test deadline scan and observe zero DLQ failures.
6. **Security Headers:** Inspect response headers with `curl -I https://abroadmate.ai` - verify presence of `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.
