import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  AuditAction,
  DegreeLevel,
  VerificationStatus,
} from "@abroadmate/database";
import { z } from "zod";

const programAdminSchema = z.object({
  id: z.string().uuid().optional(),
  universityId: z.string().uuid("বিশ্ববিদ্যালয় আইডি নির্বাচন করুন"),
  nameEn: z.string().min(2, "প্রোগ্রামের ইংরেজি নাম দিন"),
  nameBn: z.string().min(2, "প্রোগ্রামের বাংলা নাম দিন"),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "DOCTORAL", "DIPLOMA", "CERTIFICATE"]),
  facultyOrSchool: z.string().optional().nullable(),
  durationYears: z.number().positive("কোর্সের মেয়াদ দিন"),
  annualTuitionFee: z.number().nonnegative("বার্ষিক টিউশন ফি দিন"),
  tuitionFeeCurrency: z.string().min(2).max(4).default("GBP"),
  intakeMonths: z.array(z.string()).min(1, "ইনটেক মাস নির্বাচন করুন"),
  applicationDeadline: z.string().optional().nullable(),
  officialProgramUrl: z.string().url("অফিশিয়াল প্রোগ্রামের লিঙ্ক দিন"),
  verificationStatus: z
    .enum(["VERIFIED", "PENDING_REVIEW", "REJECTED", "DEPRECATED", "NEEDS_UPDATE"])
    .default("VERIFIED"),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
      AppRole.SUPPORT_ADMIN,
      AppRole.CONTENT_MANAGER,
    ]);

    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");
    const search = searchParams.get("search");

    const where: any = {};
    if (universityId) {
      where.universityId = universityId;
    }
    if (search) {
      where.OR = [
        { titleEn: { contains: search, mode: "insensitive" } },
        { titleBn: { contains: search, mode: "insensitive" } },
      ];
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { titleEn: "asc" },
      include: {
        university: {
          select: { id: true, nameEn: true, nameBn: true, countryCode: true },
        },
        admissionRequirements: true,
      },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "প্রোগ্রামের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = programAdminSchema.safeParse(body);

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

    let program;
    let action: AuditAction = AuditAction.CREATE;
    let prevVal = null;

    if (data.id) {
      action = AuditAction.UPDATE;
      const existing = await prisma.program.findUnique({
        where: { id: data.id },
      });
      prevVal = existing ? JSON.stringify(existing) : null;

      program = await prisma.program.update({
        where: { id: data.id },
        data: {
          universityId: data.universityId,
          titleEn: data.nameEn,
          titleBn: data.nameBn,
          degreeLevel: data.degreeLevel as DegreeLevel,
          department: data.facultyOrSchool || "Department of Studies",
          durationMonths: Math.round(data.durationYears * 12),
          annualTuitionAmount: data.annualTuitionFee,
          tuitionCurrencyCode: data.tuitionFeeCurrency,
          officialProgramUrl: data.officialProgramUrl,
          officialSourceUrl: data.officialProgramUrl,
          lastVerifiedAt: new Date(),
        },
      });
    } else {
      program = await prisma.program.create({
        data: {
          universityId: data.universityId,
          titleEn: data.nameEn,
          titleBn: data.nameBn,
          degreeLevel: data.degreeLevel as DegreeLevel,
          department: data.facultyOrSchool || "Department of Studies",
          durationMonths: Math.round(data.durationYears * 12),
          annualTuitionAmount: data.annualTuitionFee,
          tuitionCurrencyCode: data.tuitionFeeCurrency,
          officialProgramUrl: data.officialProgramUrl,
          officialSourceUrl: data.officialProgramUrl,
          lastVerifiedAt: new Date(),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action,
        resourceType: "PROGRAM",
        resourceId: program.id,
        previousValue: prevVal,
        newValue: JSON.stringify(program),
        changesJson: JSON.stringify({
          titleEn: program.titleEn,
          tuitionFee: program.annualTuitionAmount,
          currency: program.tuitionCurrencyCode,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: program,
      message:
        action === AuditAction.CREATE
          ? "নতুন কোর্স/প্রোগ্রাম সফলভাবে যুক্ত হয়েছে।"
          : "কোর্স/প্রোগ্রামের তথ্য সফলভাবে হালনাগাদ করা হয়েছে।",
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "প্রোগ্রামের তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
