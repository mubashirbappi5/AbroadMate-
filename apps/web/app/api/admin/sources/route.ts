import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  VerificationStatus,
  AuditAction,
} from "@abroadmate/database";
import { sourceUpsertSchema, verifySourceSchema } from "@abroadmate/validation";

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
    const status = searchParams.get("status");
    const expiredOnly = searchParams.get("expiredOnly") === "true";

    const now = new Date();
    const where: any = {};

    if (countryCode) {
      where.countryCode = countryCode;
    }
    if (status) {
      where.status = status;
    }
    if (expiredOnly) {
      where.nextReviewDate = { lte: now };
    }

    const sources = await prisma.informationSource.findMany({
      where,
      orderBy: [{ nextReviewDate: "asc" }, { lastVerifiedAt: "desc" }],
      include: {
        country: {
          select: { code: true, nameEn: true, nameBn: true, flagEmoji: true },
        },
        verifications: {
          take: 3,
          orderBy: { verifiedAt: "desc" },
          include: {
            verifiedByUser: {
              select: { fullName: true, email: true },
            },
          },
        },
        changeLogs: {
          where: { isResolved: false },
          take: 5,
        },
        _count: {
          select: { records: true, changeLogs: true },
        },
      },
      take: 100,
    });

    const sourcesWithHealth = sources.map((source) => {
      const isExpired = source.nextReviewDate ? new Date(source.nextReviewDate) <= now : false;
      const daysUntilReview = source.nextReviewDate
        ? Math.round(
            (new Date(source.nextReviewDate).getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      return {
        ...source,
        isExpired,
        daysUntilReview,
      };
    });

    return NextResponse.json({
      success: true,
      data: sourcesWithHealth,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "তথ্যসূত্রের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
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

    // Check if this is a verification action
    if (body.action === "VERIFY") {
      const verifyParse = verifySourceSchema.safeParse(body);
      if (!verifyParse.success) {
        return NextResponse.json(
          {
            success: false,
            error: "ভেরিফিকেশন ইনপুট ভুল।",
            details: verifyParse.error.flatten(),
          },
          { status: 400 }
        );
      }

      const { sourceId, verificationMethod, verificationNotes } = verifyParse.data;
      const adminUserId = session.user.id;
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 90); // Next review in 90 days

      const updated = await prisma.$transaction(async (tx) => {
        const source = await tx.informationSource.update({
          where: { id: sourceId },
          data: {
            status: VerificationStatus.VERIFIED,
            lastVerifiedAt: new Date(),
            nextReviewDate,
          },
        });

        await tx.verificationRecord.create({
          data: {
            sourceId,
            verifiedByUserId: adminUserId,
            verificationMethod,
            verificationNotes: verificationNotes || "রুটিন যাচাই সম্পন্ন।",
          },
        });

        await tx.auditLog.create({
          data: {
            userId: adminUserId,
            action: AuditAction.VERIFY,
            resourceType: "INFORMATION_SOURCE",
            resourceId: sourceId,
            changesJson: JSON.stringify({
              status: VerificationStatus.VERIFIED,
              method: verificationMethod,
            }),
          },
        });

        return source;
      });

      return NextResponse.json({
        success: true,
        data: updated,
        message: "তথ্যসূত্র সফলভাবে ভেরিফাই করা হয়েছে। পরবর্তী রিভিউ ৯০ দিন পর নির্ধারিত।",
      });
    }

    // Standard upsert
    const parseResult = sourceUpsertSchema.safeParse(body);
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

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + data.nextReviewDays);

    let source;
    let action: AuditAction = AuditAction.CREATE;
    let prevVal = null;

    if (data.id) {
      action = AuditAction.UPDATE;
      const existing = await prisma.informationSource.findUnique({
        where: { id: data.id },
      });
      prevVal = existing ? JSON.stringify(existing) : null;

      source = await prisma.informationSource.update({
        where: { id: data.id },
        data: {
          title: data.title,
          authorityName: data.authorityName,
          officialUrl: data.officialUrl,
          countryCode: data.countryCode || null,
          sourceCategory: data.sourceCategory,
          status: data.status as VerificationStatus,
          lastVerifiedAt: new Date(),
          nextReviewDate,
        },
      });
    } else {
      source = await prisma.informationSource.create({
        data: {
          title: data.title,
          authorityName: data.authorityName,
          officialUrl: data.officialUrl,
          countryCode: data.countryCode || null,
          sourceCategory: data.sourceCategory,
          status: data.status as VerificationStatus,
          lastVerifiedAt: new Date(),
          nextReviewDate,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action,
        resourceType: "INFORMATION_SOURCE",
        resourceId: source.id,
        previousValue: prevVal,
        newValue: JSON.stringify(source),
        changesJson: JSON.stringify({
          title: source.title,
          status: source.status,
          nextReviewDate: source.nextReviewDate,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: source,
      message:
        action === AuditAction.CREATE
          ? "নতুন অফিসিয়াল তথ্যসূত্র সফলভাবে যুক্ত হয়েছে।"
          : "তথ্যসূত্রের বিবরণ সফলভাবে হালনাগাদ করা হয়েছে।",
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "তথ্যসূত্র সংরক্ষণে সমস্যা হয়েছে।" },
      { status }
    );
  }
}
