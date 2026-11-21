import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole, AuditAction, VerificationStatus } from "@abroadmate/database";
import { adminUniversityUpsertSchema } from "@abroadmate/validation";

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.CONTENT_MANAGER,
    ]);

    const body = await request.json();
    const validation = adminUniversityUpsertSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "বিশ্ববিদ্যালয়ের তথ্য ভ্যালিডেশন ব্যর্থ হয়েছে।",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    let university;

    if (data.id) {
      university = await prisma.university.update({
        where: { id: data.id },
        data: {
          countryCode: data.countryCode,
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          city: data.city,
          stateOrProvince: data.stateOrProvince || null,
          worldRank: data.worldRank || null,
          websiteUrl: data.websiteUrl,
          admissionsUrl: data.admissionsUrl || null,
          applicationUrl: data.applicationUrl || null,
          institutionType: data.institutionType,
          accreditationDetailsBn: data.accreditationDetailsBn,
          recognizingAuthority: data.recognizingAuthority,
          institutionRegistryCode: data.institutionRegistryCode || null,
          internationalStudentUrl: data.internationalStudentUrl || null,
          verificationStatus: data.verificationStatus as VerificationStatus,
          isRecognized: data.isRecognized,
          isPublic: data.isPublic,
          officialSourceUrl: data.officialSourceUrl,
          lastVerifiedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.UPDATE,
          resourceType: "UNIVERSITY",
          resourceId: university.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
          changesJson: JSON.stringify({ nameEn: data.nameEn, status: data.verificationStatus }),
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
          websiteUrl: data.websiteUrl,
          admissionsUrl: data.admissionsUrl || null,
          applicationUrl: data.applicationUrl || null,
          institutionType: data.institutionType,
          accreditationDetailsBn: data.accreditationDetailsBn,
          recognizingAuthority: data.recognizingAuthority,
          institutionRegistryCode: data.institutionRegistryCode || null,
          internationalStudentUrl: data.internationalStudentUrl || null,
          verificationStatus: data.verificationStatus as VerificationStatus,
          isRecognized: data.isRecognized,
          isPublic: data.isPublic,
          officialSourceUrl: data.officialSourceUrl,
          lastVerifiedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.CREATE,
          resourceType: "UNIVERSITY",
          resourceId: university.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
          changesJson: JSON.stringify({ nameEn: data.nameEn, status: data.verificationStatus }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "বিশ্ববিদ্যালয়ের তথ্য সফলভাবে সংরক্ষিত হয়েছে!",
      data: university,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "বিশ্ববিদ্যালয় সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
