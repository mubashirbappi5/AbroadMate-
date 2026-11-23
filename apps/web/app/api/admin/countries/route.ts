import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  AuditAction,
} from "@abroadmate/database";
import { adminCountryUpsertSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
      AppRole.SUPPORT_ADMIN,
      AppRole.CONTENT_MANAGER,
    ]);

    const countries = await prisma.country.findMany({
      orderBy: { code: "asc" },
      include: {
        visaTypes: true,
        visaRequirements: {
          include: {
            versions: {
              where: { isArchived: false },
              take: 1,
              orderBy: { versionNumber: "desc" },
              include: {
                financialRules: true,
                documentRequirements: true,
              },
            },
          },
        },
        sources: {
          take: 5,
          orderBy: { lastVerifiedAt: "desc" },
        },
        _count: {
          select: { universities: true, scholarships: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: countries,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "দেশের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ]);

    const body = await request.json();
    const parseResult = adminCountryUpsertSchema.safeParse(body);

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

    // Check existing
    const existing = await prisma.country.findUnique({
      where: { code: data.code },
    });

    const isNew = !existing;

    const result = await prisma.$transaction(async (tx) => {
      const country = await tx.country.upsert({
        where: { code: data.code },
        update: {
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          flagEmoji: data.flagEmoji,
          currencyCode: data.currencyCode,
          currencySymbol: data.currencySymbol,
          approxBdtRate: data.approxBdtRate,
          officialLanguage: data.officialLanguage,
          postStudyWorkDurationBn: data.postStudyWorkDurationBn,
          avgMonthlyLivingCost: data.avgMonthlyLivingCost,
          blockedAccountRequired: data.blockedAccountRequired,
          officialImmigrationUrl: data.officialImmigrationUrl,
          dhakaEmbassyName: data.dhakaEmbassyName,
          dhakaEmbassyUrl: data.dhakaEmbassyUrl,
          educationSystemOverviewBn: data.educationSystemOverviewBn,
          tuitionCostRangesBn: data.tuitionCostRangesBn,
          livingCostInfoBn: data.livingCostInfoBn,
          lastVerifiedAt: new Date(),
        },
        create: {
          code: data.code,
          iso2: data.iso2,
          nameEn: data.nameEn,
          nameBn: data.nameBn,
          flagEmoji: data.flagEmoji,
          currencyCode: data.currencyCode,
          currencySymbol: data.currencySymbol,
          approxBdtRate: data.approxBdtRate,
          officialLanguage: data.officialLanguage,
          postStudyWorkDurationBn: data.postStudyWorkDurationBn,
          avgMonthlyLivingCost: data.avgMonthlyLivingCost,
          blockedAccountRequired: data.blockedAccountRequired,
          officialImmigrationUrl: data.officialImmigrationUrl,
          dhakaEmbassyName: data.dhakaEmbassyName,
          dhakaEmbassyUrl: data.dhakaEmbassyUrl,
          educationSystemOverviewBn: data.educationSystemOverviewBn,
          tuitionCostRangesBn: data.tuitionCostRangesBn,
          livingCostInfoBn: data.livingCostInfoBn,
          lastVerifiedAt: new Date(),
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: isNew ? AuditAction.CREATE : AuditAction.UPDATE,
          resourceType: "COUNTRY",
          resourceId: country.code,
          previousValue: existing ? JSON.stringify(existing) : null,
          newValue: JSON.stringify(country),
          changesJson: JSON.stringify({
            code: country.code,
            nameEn: country.nameEn,
            approxBdtRate: country.approxBdtRate,
            postStudyWorkDurationBn: country.postStudyWorkDurationBn,
          }),
        },
      });

      return country;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: isNew ? "নতুন দেশ সফলভাবে যুক্ত হয়েছে।" : "দেশের তথ্য সফলভাবে হালনাগাদ করা হয়েছে।",
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "দেশের তথ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
