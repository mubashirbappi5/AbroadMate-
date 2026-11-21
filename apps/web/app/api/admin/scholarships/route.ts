import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  VerificationStatus,
  AuditAction,
  DegreeLevel,
  ScholarshipProviderType,
  ScholarshipFundingType,
} from "@abroadmate/database";
import { adminScholarshipUpsertSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = adminScholarshipUpsertSchema.safeParse(body);

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

    const { rule, ...schData } = parseResult.data;
    const adminUserId = session.user.id;

    const result = await prisma.$transaction(async (tx) => {
      let scholarship;
      let action: AuditAction = AuditAction.CREATE;

      if (schData.id) {
        action = AuditAction.UPDATE;
        scholarship = await tx.scholarship.update({
          where: { id: schData.id },
          data: {
            ...schData,
            providerType: schData.providerType as ScholarshipProviderType,
            fundingType: schData.fundingType as ScholarshipFundingType,
            applicationDeadline: schData.applicationDeadline
              ? new Date(schData.applicationDeadline)
              : null,
            verificationStatus: VerificationStatus.VERIFIED,
            lastVerifiedAt: new Date(),
            verifiedByAdminId: adminUserId,
          },
        });

        // Update eligibility rule
        if (rule) {
          await tx.scholarshipEligibilityRule.deleteMany({
            where: { scholarshipId: scholarship.id },
          });
          await tx.scholarshipEligibilityRule.create({
            data: {
              scholarshipId: scholarship.id,
              ...rule,
              eligibleDegreeLevels: rule.eligibleDegreeLevels as DegreeLevel[],
            },
          });
        }
      } else {
        scholarship = await tx.scholarship.create({
          data: {
            ...schData,
            providerType: schData.providerType as ScholarshipProviderType,
            fundingType: schData.fundingType as ScholarshipFundingType,
            applicationDeadline: schData.applicationDeadline
              ? new Date(schData.applicationDeadline)
              : null,
            verificationStatus: VerificationStatus.VERIFIED,
            lastVerifiedAt: new Date(),
            verifiedByAdminId: adminUserId,
          },
        });

        if (rule) {
          await tx.scholarshipEligibilityRule.create({
            data: {
              scholarshipId: scholarship.id,
              ...rule,
              eligibleDegreeLevels: rule.eligibleDegreeLevels as DegreeLevel[],
            },
          });
        }
      }

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action,
          resourceType: "Scholarship",
          resourceId: scholarship.id,
          changesJson: JSON.stringify({
            titleEn: scholarship.titleEn,
            providerName: scholarship.providerName,
            fundingType: scholarship.fundingType,
          }),
        },
      });

      return scholarship;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "স্কলারশিপ সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে।",
    });
  } catch (err: any) {
    console.error("Error in /api/admin/scholarships:", err);
    return NextResponse.json(
      {
        success: false,
        error: "স্কলারশিপ সংরক্ষণে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
