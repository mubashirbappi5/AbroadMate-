import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole, AuditAction, DegreeLevel, SubjectCategory } from "@abroadmate/database";
import { adminProgramUpsertSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.CONTENT_MANAGER,
    ]);

    const body = await request.json();
    const validation = adminProgramUpsertSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "প্রোগ্রামের তথ্য ভ্যালিডেশন ব্যর্থ হয়েছে।",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    let program;

    if (data.id) {
      program = await prisma.$transaction(async (tx) => {
        const updated = await tx.program.update({
          where: { id: data.id },
          data: {
            universityId: data.universityId,
            titleEn: data.titleEn,
            titleBn: data.titleBn,
            degreeLevel: data.degreeLevel as DegreeLevel,
            subjectCategory: data.subjectCategory as SubjectCategory,
            department: data.department,
            durationMonths: data.durationMonths,
            studyMode: data.studyMode,
            annualTuitionAmount: data.annualTuitionAmount,
            tuitionCurrencyCode: data.tuitionCurrencyCode,
            prerequisitesBn: data.prerequisitesBn || null,
            officialProgramUrl: data.officialProgramUrl,
            officialSourceUrl: data.officialSourceUrl,
            lastVerifiedAt: new Date(),
          },
        });

        await tx.admissionRequirement.upsert({
          where: { programId: updated.id },
          update: {
            minGpaOrCgpa: data.minGpaOrCgpa,
            gpaScale: data.gpaScale,
            minIeltsOverall: data.minIeltsOverall,
            minIeltsEachBand: data.minIeltsEachBand,
            greRequired: data.greRequired,
            workExperienceMonths: data.workExperienceMonths,
            notesBn: data.notesBn || null,
          },
          create: {
            programId: updated.id,
            minGpaOrCgpa: data.minGpaOrCgpa,
            gpaScale: data.gpaScale,
            minIeltsOverall: data.minIeltsOverall,
            minIeltsEachBand: data.minIeltsEachBand,
            greRequired: data.greRequired,
            workExperienceMonths: data.workExperienceMonths,
            notesBn: data.notesBn || null,
          },
        });

        return updated;
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.UPDATE,
          resourceType: "PROGRAM",
          resourceId: program.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
          changesJson: JSON.stringify({ titleEn: data.titleEn }),
        },
      });
    } else {
      program = await prisma.$transaction(async (tx) => {
        const created = await tx.program.create({
          data: {
            universityId: data.universityId,
            titleEn: data.titleEn,
            titleBn: data.titleBn,
            degreeLevel: data.degreeLevel as DegreeLevel,
            subjectCategory: data.subjectCategory as SubjectCategory,
            department: data.department,
            durationMonths: data.durationMonths,
            studyMode: data.studyMode,
            annualTuitionAmount: data.annualTuitionAmount,
            tuitionCurrencyCode: data.tuitionCurrencyCode,
            prerequisitesBn: data.prerequisitesBn || null,
            officialProgramUrl: data.officialProgramUrl,
            officialSourceUrl: data.officialSourceUrl,
            lastVerifiedAt: new Date(),
          },
        });

        await tx.admissionRequirement.create({
          data: {
            programId: created.id,
            minGpaOrCgpa: data.minGpaOrCgpa,
            gpaScale: data.gpaScale,
            minIeltsOverall: data.minIeltsOverall,
            minIeltsEachBand: data.minIeltsEachBand,
            greRequired: data.greRequired,
            workExperienceMonths: data.workExperienceMonths,
            notesBn: data.notesBn || null,
          },
        });

        return created;
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.CREATE,
          resourceType: "PROGRAM",
          resourceId: program.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
          changesJson: JSON.stringify({ titleEn: data.titleEn }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "প্রোগ্রামের তথ্য সফলভাবে সংরক্ষিত হয়েছে!",
      data: program,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "প্রোগ্রাম সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
