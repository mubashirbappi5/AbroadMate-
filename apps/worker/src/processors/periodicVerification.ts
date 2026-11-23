import { prisma, AuditAction, VerificationStatus } from "@abroadmate/database";

export async function processPeriodicDataVerificationJob() {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 1. Check exchange rate updates
  const recentRates = await prisma.exchangeRateAudit.findMany({
    where: { effectiveDate: { gte: dayAgo } },
  });

  // 2. Count unverified catalog items
  const [unverifiedUnis, unverifiedScholarships, unverifiedSources] = await Promise.all([
    prisma.university.count({
      where: { verificationStatus: { not: VerificationStatus.VERIFIED } },
    }),
    prisma.scholarship.count({
      where: { verificationStatus: { not: VerificationStatus.VERIFIED } },
    }),
    prisma.informationSource.count({
      where: { status: { not: VerificationStatus.VERIFIED } },
    }),
  ]);

  const auditSummary = {
    verifiedRatesCount: recentRates.length,
    unverifiedUniversities: unverifiedUnis,
    unverifiedScholarships,
    unverifiedSources,
    scannedAt: now.toISOString(),
  };

  // Record System Audit Log
  await prisma.auditLog.create({
    data: {
      action: AuditAction.VERIFY,
      resourceType: "DATA_VERIFICATION_AUDIT",
      resourceId: "DAILY_SCAN",
      changesJson: JSON.stringify(auditSummary),
    },
  });

  return { success: true, auditSummary };
}
