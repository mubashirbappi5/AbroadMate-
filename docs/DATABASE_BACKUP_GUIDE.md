# AbroadMate - Database Backup & Disaster Recovery Guide

**Database System:** PostgreSQL 16 (Hosted on Supabase)  
**ORM:** Prisma Client  
**Backup Frequency:** Daily at 02:00 UTC (08:00 BST) + Automated On-Demand  
**Retention Policy:** 14-Day Rolling Window  
**Recovery Objectives:** RPO $\le 6$ Hours | RTO $\le 30$ Minutes

---

## 1. Backup Strategy Overview

AbroadMate employs a dual-layer backup architecture:
1. **Supabase Native Point-in-Time Recovery (PITR):** Continuous Write-Ahead Log (WAL) archiving allowing restoration to any exact second within the last 7 days.
2. **Automated Standalone Dump Scripts:** Executed via cron or CI to create portable, compressed SQL dumps (`.sql.gz` or `.zip`) alongside cryptographic SHA-256 integrity checksums.

---

## 2. Automated Backup Scripts

### 2.1 Linux / macOS / Railway Script (`scripts/backup-database.sh`)
```bash
#!/bin/bash
# Executes pg_dump with gzip compression, SHA-256 verification, and 14-day rotation
./scripts/backup-database.sh
```

**Workflow:**
1. Validates that `DIRECT_URL` or `DATABASE_URL` is set in the environment.
2. Runs `pg_dump` with `--no-owner --no-acl --quote-all-identifiers`.
3. Streams output into gzip compression at level 9 (`.sql.gz`).
4. Generates a cryptographic SHA-256 hash file (`.sha256`).
5. Prunes backup files older than 14 days automatically.

### 2.2 Windows Server / PowerShell Script (`scripts/backup-database.ps1`)
```powershell
# Executes PowerShell automated backup with zip compression and hash verification
.\scripts\backup-database.ps1 -BackupDir "./backups/postgres" -RetentionDays 14
```

---

## 3. Scheduling Automated Backups (Cron / GitHub Actions)

### 3.1 Linux Server Crontab
Add the following line to the crontab (`crontab -e`) to execute daily at 02:00 UTC:
```cron
0 2 * * * cd /opt/abroadmate && DIRECT_URL="$DIRECT_URL" /opt/abroadmate/scripts/backup-database.sh >> /var/log/abroadmate_backup.log 2>&1
```

### 3.2 GitHub Actions Workflow (`.github/workflows/db-backup.yml`)
Can be scheduled as a daily workflow storing encrypted artifacts in AWS S3 or Cloudflare R2.

---

## 4. Verification & Integrity Check

Before storing or restoring any backup, verify the cryptographic checksum to confirm the backup is uncorrupted:

```bash
# Verify checksum on Linux/macOS
sha256sum -c backups/postgres/abroadmate_backup_20261123_020000.sha256

# Output should read:
# abroadmate_backup_20261123_020000.sql.gz: OK
```

In PowerShell:
```powershell
Get-FileHash -Path ".\backups\postgres\abroadmate_backup_20261123_020000.sql.zip" -Algorithm SHA256
```

---

## 5. Complete Database Restoration Procedure

In the event of accidental data corruption, migration rollback, or catastrophic infrastructure failure, follow these steps to restore:

### Step 1: Prepare Target Database
If restoring to a new database instance, ensure extensions are enabled:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Step 2: Decompress & Restore Backup
```bash
# 1. Unzip the archive
gunzip -k backups/postgres/abroadmate_backup_20261123_020000.sql.gz

# 2. Restore into target database using psql
psql "${TARGET_DIRECT_URL}" -f backups/postgres/abroadmate_backup_20261123_020000.sql
```

### Step 3: Run Post-Restoration Verification
Verify that critical tables and row counts are populated:
```bash
# Run Prisma schema validation and client regeneration
pnpm --filter @abroadmate/database db:generate

# Execute test suite to confirm database relations
pnpm exec vitest run tests/integration/auth-database.test.ts
```

---

## 6. Disaster Recovery Runbook Checklist

- [ ] Declare incident and notify administrative team.
- [ ] Temporarily enable Maintenance Mode on Vercel frontend if corruption is active.
- [ ] Identify latest clean backup and verify SHA-256 checksum.
- [ ] Restore database to target staging or production database.
- [ ] Run integrity checks and integration tests.
- [ ] Point `DATABASE_URL` and `DIRECT_URL` in Vercel & Railway to the restored database.
- [ ] Disable Maintenance Mode and verify student dashboard at `/dashboard`.
- [ ] File Incident Post-Mortem and document root cause.
