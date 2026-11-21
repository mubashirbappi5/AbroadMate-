import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole, VerificationStatus } from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.CONTENT_MANAGER,
    ]);

    const [
      totalCountries,
      totalUniversities,
      verifiedUniversities,
      pendingUniversities,
      totalPrograms,
      universitiesList,
    ] = await Promise.all([
      prisma.country.count(),
      prisma.university.count(),
      prisma.university.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      prisma.university.count({ where: { verificationStatus: VerificationStatus.PENDING_REVIEW } }),
      prisma.program.count(),
      prisma.university.findMany({
        take: 20,
        orderBy: { updatedAt: "desc" },
        include: {
          country: true,
          _count: {
            select: { programs: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalCountries,
          totalUniversities,
          verifiedUniversities,
          pendingUniversities,
          totalPrograms,
        },
        recentUniversities: universitiesList,
      },
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "প্রশাসনিক তথ্য লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
