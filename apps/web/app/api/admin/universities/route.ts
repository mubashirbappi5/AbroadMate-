import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  AuditAction,
  VerificationStatus,
} from "@abroadmate/database";
import { z } from "zod";

const universityAdminSchema = z.object({
  id: z.string().uuid().optional(),
  countryCode: z.string().min(2).max(3),
  nameEn: z.string().min(2, "বিশ্ববিদ্যালয়ের ইংরেজি নাম দিন"),
  nameBn: z.string().min(2, "বিশ্ববিদ্যালয়ের বাংলা নাম দিন"),
  city: z.string().min(2, "শহরের নাম দিন"),
  stateOrProvince: z.string().optional().nullable(),
  worldRank: z.number().int().positive().optional().nullable(),
  institutionRegistryCode: z.string().optional().nullable(),
  websiteUrl: z.string().url("সঠিক ওয়েবসাইট লিঙ্ক দিন"),
  admissionsUrl: z.string().url().optional().nullable(),
  internationalStudentUrl: z.string().url().optional().nullable(),
  officialSourceUrl: z.string().url().optional().nullable(),
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
    const countryCode = searchParams.get("countryCode");
    const search = searchParams.get("search");

    const where: any = {};
    if (countryCode) {
      where.countryCode = countryCode;
    }
    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: "insensitive" } },
        { nameBn: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const universities = await prisma.university.findMany({
      where,
      orderBy: { nameEn: "asc" },
      include: {
        country: {
          select: { code: true, nameEn: true, nameBn: true, flagEmoji: true },
        },
        _count: {
          select: { programs: true, scholarships: true },
        },
      },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: universities,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "বিশ্ববিদ্যালয়ের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
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
    const parseResult = universityAdminSchema.safeParse(body);

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

    let university;
    let action: AuditAction = AuditAction.CREATE;
    let prevVal = null;

    if (data.id) {
      action = AuditAction.UPDATE;
      const existing = await prisma.university.findUnique({
        where: { id: data.id },
      });
      prevVal = existing ? JSON.stringify(existing) : null;

      university = await prisma.university.update({
        where: { id: data.id },
        data: {
          countryCode: data.countryCode,
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          city: data.city,
          stateOrProvince: data.stateOrProvince || null,
          worldRank: data.worldRank || null,
          institutionRegistryCode: data.institutionRegistryCode || null,
          websiteUrl: data.websiteUrl,
          admissionsUrl: data.admissionsUrl || null,
          internationalStudentUrl: data.internationalStudentUrl || null,
          officialSourceUrl: data.officialSourceUrl || data.websiteUrl,
          verificationStatus: data.verificationStatus as VerificationStatus,
          lastVerifiedAt: new Date(),
        },
      });
    } else {
      university = await prisma.university.create({
        data: {
          countryCode: data.countryCode,
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          city: data.city,
          stateOrProvince: data.stateOrProvince || null,
          worldRank: data.worldRank || null,
          institutionRegistryCode: data.institutionRegistryCode || null,
          websiteUrl: data.websiteUrl,
          admissionsUrl: data.admissionsUrl || null,
          internationalStudentUrl: data.internationalStudentUrl || null,
          officialSourceUrl: data.officialSourceUrl || data.websiteUrl,
          verificationStatus: data.verificationStatus as VerificationStatus,
          lastVerifiedAt: new Date(),
        },
      });
    }

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action,
        resourceType: "UNIVERSITY",
        resourceId: university.id,
        previousValue: prevVal,
        newValue: JSON.stringify(university),
        changesJson: JSON.stringify({
          nameEn: university.nameEn,
          countryCode: university.countryCode,
          status: university.verificationStatus,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: university,
      message:
        action === AuditAction.CREATE
          ? "নতুন বিশ্ববিদ্যালয় সফলভাবে যুক্ত হয়েছে।"
          : "বিশ্ববিদ্যালয়ের তথ্য সফলভাবে হালনাগাদ করা হয়েছে।",
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "বিশ্ববিদ্যালয়ের তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
