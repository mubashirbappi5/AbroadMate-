# AbroadMate - Environment Variable & Secret Configuration Guide

**Version:** 1.0.0-PROD  
**Target:** Production, Staging, and Development Environments  
**Confidentiality:** RESTRICTED - Never expose Secret or Critical variables to clients.

---

## 1. Environment Variable Matrix by Platform

| Environment Variable | Service Host | Sensitivity | Required in Prod |
| :--- | :---: | :---: | :---: |
| `NODE_ENV` | Vercel & Railway | Public | Yes |
| `NEXT_PUBLIC_APP_URL` | Vercel | Public | Yes |
| `NEXT_PUBLIC_APP_NAME` | Vercel | Public | Yes |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Vercel | Public | Yes |
| `DATABASE_URL` | Vercel & Railway | **Secret** | Yes |
| `DIRECT_URL` | Vercel & Railway | **Secret** | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Public | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Public | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel & Railway | **Critical** | Yes |
| `SUPABASE_STORAGE_BUCKET_DOCUMENTS` | Vercel & Railway | Configuration | Yes |
| `REDIS_HOST` | Vercel & Railway | **Secret** | Yes |
| `REDIS_PORT` | Vercel & Railway | Configuration | Yes |
| `REDIS_PASSWORD` | Vercel & Railway | **Critical** | Yes |
| `REDIS_TLS` | Vercel & Railway | Configuration | Yes |
| `OPENAI_API_KEY` | Vercel & Railway | **Critical** | Yes |
| `OPENAI_MODEL` | Vercel & Railway | Configuration | Yes |
| `EMAIL_FROM` | Railway | Configuration | Yes |
| `SMTP_HOST` | Railway | **Secret** | Yes |
| `SMTP_PORT` | Railway | Configuration | Yes |
| `SMTP_USER` | Railway | **Secret** | Yes |
| `SMTP_PASSWORD` | Railway | **Critical** | Yes |
| `TELEGRAM_BOT_TOKEN` | Railway | **Critical** | Optional |
| `SENTRY_DSN` | Vercel & Railway | **Secret** | Optional |
| `NEXT_PUBLIC_SENTRY_DSN` | Vercel | Public | Optional |

---

## 2. Comprehensive Field Specifications

### 2.1 Core Application
- **`NODE_ENV`**: Set to `"production"` in live deployment. Enables production React optimizations, strict cookie flags, and disables verbose debug logging.
- **`PORT`**: Default `3000`. Set by container hosting platforms automatically.
- **`NEXT_PUBLIC_APP_URL`**: Canonical base URL (`https://abroadmate.ai`). Used in email action links, OAuth redirects, and OpenGraph metadata.
- **`NEXT_PUBLIC_DEFAULT_LOCALE`**: Default language code (`"bn"` for Bengali-first experience).

### 2.2 PostgreSQL Database & Connection Pooling
- **`DATABASE_URL`**: Pooled PostgreSQL connection string pointing to Supabase PgBouncer (Port 6543) with `?pgbouncer=true&connection_limit=15`. Required for Next.js Serverless runtime to prevent connection pool exhaustion.
- **`DIRECT_URL`**: Direct session-mode PostgreSQL connection string (Port 5432). Required for Prisma schema migrations (`pnpm db:push`), seeds (`pnpm db:seed`), and persistent worker processes.

### 2.3 Supabase Auth & Storage
- **`NEXT_PUBLIC_SUPABASE_URL`**: Public Supabase project REST and Auth API gateway (`https://[ref].supabase.co`).
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: Public Anonymous API key used by client-side browser SDK for login, signup, and session refresh.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Master administrative key bypassing Row Level Security (RLS). Must **NEVER** be prefixed with `NEXT_PUBLIC_` or bundled in client code.
- **`SUPABASE_STORAGE_BUCKET_DOCUMENTS`**: Storage bucket identifier (`student-documents`). Must be configured as a **private** bucket in Supabase.

### 2.4 Redis & BullMQ Background Queues
- **`REDIS_HOST`**: Hostname of Upstash or managed Redis instance (e.g., `ap-southeast-1-redis.upstash.io`).
- **`REDIS_PORT`**: Typically `6379`.
- **`REDIS_PASSWORD`**: Strong authentication password for Redis.
- **`REDIS_TLS`**: Set to `true` when connecting to cloud Redis providers requiring SSL/TLS encryption.

### 2.5 OpenAI AI Engine & Guardrails
- **`OPENAI_API_KEY`**: Official OpenAI platform API key starting with `sk-proj-...`.
- **`OPENAI_MODEL`**: Target model (default `"gpt-4o"`).
- **`AI_MAX_TOKENS`**: Token generation ceiling (default `2500`).
- **`AI_RATE_LIMIT_MAX_REQUESTS`**: Maximum requests per sliding window (default `25`).
- **`AI_RATE_LIMIT_WINDOW_MS`**: Sliding window duration (default `3600000` ms = 1 hour).

### 2.6 Email Delivery (Resend / SMTP)
- **`EMAIL_FROM`**: Sender address (e.g. `AbroadMate <notifications@abroadmate.ai>`).
- **`SMTP_HOST`**: SMTP gateway host (`smtp.resend.com` or `smtp.sendgrid.net`).
- **`SMTP_PORT`**: `587` (STARTTLS) or `465` (SSL).
- **`SMTP_USER`**: SMTP username.
- **`SMTP_PASSWORD`**: Secure SMTP password or API token.

### 2.7 Telegram Integration
- **`TELEGRAM_BOT_TOKEN`**: Bot token generated via `@BotFather`.
- **`TELEGRAM_WEBHOOK_SECRET`**: Random secret token validating incoming Telegram updates.

### 2.8 Sentry Error Monitoring
- **`SENTRY_DSN`**: Sentry Data Source Name for error reporting.
- **`SENTRY_ENVIRONMENT`**: Deployment stage (`"production"`, `"staging"`).
- **`SENTRY_TRACES_SAMPLE_RATE`**: Performance sampling rate (recommended `0.2` for 20% in production).

---

## 3. Secret Rotation Procedure

1. **Database Credentials:** Update password in Supabase Dashboard $\to$ Update `DATABASE_URL` and `DIRECT_URL` in Vercel & Railway $\to$ Redeploy.
2. **OpenAI API Key:** Generate new key in OpenAI dashboard $\to$ Update `OPENAI_API_KEY` in Vercel & Railway $\to$ Revoke old key.
3. **Redis Password:** Update in Upstash Console $\to$ Update `REDIS_PASSWORD` in Vercel & Railway $\to$ Restart worker.
