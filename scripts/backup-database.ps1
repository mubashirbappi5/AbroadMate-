# ==============================================================================
# AbroadMate - Automated Windows / PowerShell Database Backup Script
# Performs pg_dump with SHA-256 verification and 14-day rotation policy.
# ==============================================================================

param(
    [string]$BackupDir = "./backups/postgres",
    [int]$RetentionDays = 14
)

$ErrorActionPreference = "Stop"

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFileName = "abroadmate_backup_${Timestamp}.sql"
$BackupFilePath = Join-Path $BackupDir $BackupFileName
$ZipFilePath = "${BackupFilePath}.zip"
$ChecksumFilePath = Join-Path $BackupDir "abroadmate_backup_${Timestamp}.sha256"

$TargetUrl = $env:DIRECT_URL
if ([string]::IsNullOrWhiteSpace($TargetUrl)) {
    $TargetUrl = $env:DATABASE_URL
}

if ([string]::IsNullOrWhiteSpace($TargetUrl)) {
    Write-Error "[-] ERROR: DIRECT_URL or DATABASE_URL environment variable is not defined."
    exit 1
}

# Ensure directory exists
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

Write-Host "[*] [${Timestamp}] Initiating AbroadMate database backup..."

# Run pg_dump
try {
    pg_dump "$TargetUrl" --format=plain --no-owner --no-acl --file="$BackupFilePath"
    
    if (-not (Test-Path $BackupFilePath) -or (Get-Item $BackupFilePath).Length -eq 0) {
        throw "Backup file is missing or empty."
    }

    # Compress file
    Compress-Archive -Path $BackupFilePath -DestinationPath $ZipFilePath -CompressionLevel Optimal
    Remove-Item -Path $BackupFilePath -Force

    # Generate SHA-256 Checksum
    $hash = (Get-FileHash -Path $ZipFilePath -Algorithm SHA256).Hash
    "$hash  abroadmate_backup_${Timestamp}.sql.zip" | Out-File -FilePath $ChecksumFilePath -Encoding utf8

    Write-Host "[+] Backup created: $ZipFilePath"
    Write-Host "[+] Checksum written: $ChecksumFilePath"

    # Retention Pruning
    $CutoffDate = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -Path $BackupDir -File | Where-Object { $_.LastWriteTime -lt $CutoffDate } | ForEach-Object {
        Write-Host "[-] Pruning expired backup: $($_.Name)"
        Remove-Item $_.FullName -Force
    }

    Write-Host "[+] Backup completed successfully."
}
catch {
    Write-Error "[-] Backup failed: $_"
    exit 1
}
