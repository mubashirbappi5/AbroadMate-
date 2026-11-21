import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole, VerificationStatus, AuditAction, DegreeLevel } from "@abroadmate/database";
import { AdminAdmissionRequirementUpsertSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = AdminAdmissionRequirementUpsertSchema.safeParse(body);

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

    // Check if requirement already exists
    const existing = await prisma.admissionRequirement.findUnique({
      where: { programId: data.programId },
    });

    const nextVersion = existing ? existing.version + 1 : 1;

    // Run in transaction: update/create requirement, record historical version, add audit log
    const result = await prisma.$transaction(async (tx) => {
      const requirement = await tx.admissionRequirement.upsert({
        where: { programId: data.programId },
        update: {
          ...data,
          requiredDegreeLevel: data.requiredDegreeLevel as DegreeLevel,
          version: nextVersion,
          verificationStatus: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          verifiedByAdminId: adminUserId,
        },
        create: {
          ...data,
          requiredDegreeLevel: data.requiredDegreeLevel as DegreeLevel,
          version: 1,
          verificationStatus: VerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          verifiedByAdminId: adminUserId,
        },
      });

      // Archive version snapshot
      await tx.admissionRequirementVersion.create({
        data: {
          requirementId: requirement.id,
          version: requirement.version,
          verifiedByAdminId: adminUserId,
          officialSourceUrl: data.officialSourceUrl,
          changeSummaryBn: data.notesBn || "অ্যাডমিশন রিকোয়ারমেন্ট হালনাগাদ করা হয়েছে।",
          snapshotData: requirement as any,
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: existing ? AuditAction.UPDATE : AuditAction.CREATE,
          resourceType: "AdmissionRequirement",
          resourceId: requirement.id,
          changesJson: JSON.stringify({
            programId: data.programId,
            version: requirement.version,
          }),
        },
      });

      return requirement;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: `অ্যাডমিশন শর্ত সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে (ভার্সন v${result.version})।`,
    });
  } catch (err: any) {
    console.error("Error in /api/admin/requirements:", err);
    return NextResponse.json(
      {
        success: false,
        error: "অ্যাডমিশন শর্ত সংরক্ষণে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
