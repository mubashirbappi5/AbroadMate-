import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  VerificationStatus,
  AuditAction,
} from "@abroadmate/database";
import { adminVisaRequirementUpsertSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = adminVisaRequirementUpsertSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const adminUserId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Ensure or update VisaType
      const vt = await tx.visaType.upsert({
        where: {
          countryCode_visaCode: {
            countryCode: data.countryCode,
            visaCode: data.visaCode,
          },
        },
        update: {
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          officialFeeAmount: data.officialFeeAmount,
          feeCurrencyCode: data.feeCurrencyCode,
          processingDaysAvg: data.processingDaysAvg,
          officialImmigrationUrl: data.officialGazetteUrl,
          applicationAuthority: data.sourceOrganization,
          lastVerifiedAt: new Date(),
        },
        create: {
          countryCode: data.countryCode,
          visaCode: data.visaCode,
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          category: "UNDERGRADUATE_POSTGRADUATE",
          officialFeeAmount: data.officialFeeAmount,
          feeCurrencyCode: data.feeCurrencyCode,
          processingDaysAvg: data.processingDaysAvg,
          officialImmigrationUrl: data.officialGazetteUrl,
          applicationAuthority: data.sourceOrganization,
          lastVerifiedAt: new Date(),
        },
      });

      // 2. VisaRequirement container
      let vr = await tx.visaRequirement.findFirst({
        where: {
          countryCode: data.countryCode,
          visaTypeId: vt.id,
        },
      });

      if (!vr) {
        vr = await tx.visaRequirement.create({
          data: {
            countryCode: data.countryCode,
            visaTypeId: vt.id,
            isCurrentActive: true,
          },
        });
      }

      // 3. Archive prior active versions
      const activeVersions = await tx.visaRequirementVersion.findMany({
        where: {
          visaRequirementId: vr.id,
          isArchived: false,
        },
        orderBy: { versionNumber: "desc" },
      });

      let nextVersionNumber = 1;
      let previousVersionId: string | null = null;

      const latest = activeVersions[0];
      if (latest) {
        nextVersionNumber = latest.versionNumber + 1;
        previousVersionId = latest.id;

        // Archive previous active versions
        await tx.visaRequirementVersion.updateMany({
          where: {
            visaRequirementId: vr.id,
            isArchived: false,
          },
          data: {
            isArchived: true,
            effectiveToDate: new Date(),
          },
        });
      }

      // 4. Create new version snapshot (Immutable History)
      const newVersion = await tx.visaRequirementVersion.create({
        data: {
          visaRequirementId: vr.id,
          versionNumber: nextVersionNumber,
          previousVersionId,
          effectiveFromDate: data.effectiveFromDate ? new Date(data.effectiveFromDate) : new Date(),
          isArchived: false,
          changeSummaryBn: data.changeSummaryBn,
          officialGazetteUrl: data.officialGazetteUrl,
          sourceOrganization: data.sourceOrganization,
          verificationStatus: VerificationStatus.VERIFIED,
          lastCheckedDate: new Date(),
        },
      });

      // 5. Create Financial Rules
      const finRule = await tx.visaFinancialRule.create({
        data: {
          versionId: newVersion.id,
          requiredLivingFunds: data.requiredLivingFunds,
          tuitionFeeRuleBn: "প্রথম শিক্ষাবর্ষের অবশিষ্ট সম্পূর্ণ টিউশন ফি",
          fundsCurrencyCode: data.feeCurrencyCode,
          maintenancePeriodDays: data.maintenancePeriodDays,
          bankStatementPeriodMonths: data.bankStatementPeriodMonths,
          travelExpenseLocal: data.travelExpenseLocal,
          blockedAccountRequired: data.blockedAccountRequired,
          acceptedEvidenceBn: data.acceptableInstrumentsBn,
          sponsorConditionsBn: data.sponsorConditionsBn,
          acceptableInstrumentsBn: data.acceptableInstrumentsBn,
          unacceptableFundsBn: data.unacceptableFundsBn,
          sourceUrl: data.officialGazetteUrl,
        },
      });

      // 6. Record Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: AuditAction.CREATE,
          resourceType: "VISA_REQUIREMENT",
          resourceId: newVersion.id,
          changesJson: JSON.stringify({
            countryCode: data.countryCode,
            versionNumber: nextVersionNumber,
            changeSummaryBn: data.changeSummaryBn,
            requiredLivingFunds: data.requiredLivingFunds,
          }),
        },
      });

      return {
        visaType: vt,
        version: newVersion,
        financialRule: finRule,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "ভিসা নীতিমালা সংস্করণ সফলভাবে অনুমোদিত ও সংরক্ষিত হয়েছে।",
    });
  } catch (err: any) {
    console.error("Error in /api/admin/visa/requirements:", err);
    return NextResponse.json(
      {
        success: false,
        error: "ভিসা নীতিমালা সংরক্ষণে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
