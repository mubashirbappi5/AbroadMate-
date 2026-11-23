#!/bin/bash
# ==============================================================================
# AbroadMate - Automated Production PostgreSQL Backup Script
# Performs pg_dump with gzip compression, SHA-256 checksum generation,
# and enforces a 14-day retention rotation policy.
# ==============================================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/abroadmate_backup_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_DIR}/abroadmate_backup_${TIMESTAMP}.sha256"

# Verify DATABASE_URL or DIRECT_URL is present
if [ -z "${DIRECT_URL:-}" ] && [ -z "${DATABASE_URL:-}" ]; then
  echo "[-] ERROR: DIRECT_URL or DATABASE_URL environment variable is required."
  exit 1
fi

TARGET_URL="${DIRECT_URL:-$DATABASE_URL}"

# Create backup directory if it does not exist
mkdir -p "${BACKUP_DIR}"

echo "[*] [${TIMESTAMP}] Initiating AbroadMate database backup..."

# Execute pg_dump with custom compression
pg_dump "${TARGET_URL}" \
  --format=plain \
  --no-owner \
  --no-acl \
  --quote-all-identifiers \
  | gzip -9 > "${BACKUP_FILE}"

# Verify backup file was created and is non-empty
if [ ! -s "${BACKUP_FILE}" ]; then
  echo "[-] ERROR: Backup file was not created or is empty!"
  rm -f "${BACKUP_FILE}"
  exit 1
fi

# Generate SHA-256 checksum for data integrity verification
sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"
echo "[+] Backup successfully created: ${BACKUP_FILE}"
echo "[+] Integrity checksum saved: ${CHECKSUM_FILE}"

# Retention Policy: Prune backups older than $RETENTION_DAYS days
echo "[*] Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f \( -name "*.sql.gz" -o -name "*.sha256" \) -mtime +"${RETENTION_DAYS}" -exec rm -v {} \;

echo "[+] Database backup process completed successfully."
