import { NextRequest, NextResponse } from "next/server";
import { prisma, VerificationStatus, DegreeLevel } from "@abroadmate/database";
import { scholarshipFilterSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const filter = scholarshipFilterSchema.parse(query);

    const whereClause: any = {
      verificationStatus: VerificationStatus.VERIFIED,
    };

    if (filter.search) {
      whereClause.OR = [
        { titleEn: { contains: filter.search, mode: "insensitive" } },
        { titleBn: { contains: filter.search, mode: "insensitive" } },
        { providerName: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.countryCode) {
      whereClause.countryCode = filter.countryCode;
    }

    if (filter.fundingType) {
      whereClause.fundingType = filter.fundingType;
    }

    if (filter.providerType) {
      whereClause.providerType = filter.providerType;
    }

    if (filter.hasTravelSupport) {
      whereClause.travelSupport = true;
    }

    if (filter.hasStipend) {
      whereClause.livingStipendMonthly = { gt: 0 };
    }

    if (filter.degreeLevel) {
      whereClause.eligibilityRules = {
        some: {
          eligibleDegreeLevels: {
            has: filter.degreeLevel as DegreeLevel,
          },
        },
      };
    }

    const page = filter.page;
    const limit = filter.limit;
    const skip = (page - 1) * limit;

    const [total, scholarships] = await Promise.all([
      prisma.scholarship.count({ where: whereClause }),
      prisma.scholarship.findMany({
        where: whereClause,
        include: {
          country: true,
          university: true,
          eligibilityRules: true,
        },
        orderBy: [{ tuitionCoveragePercent: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        scholarships,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err: any) {
    console.error("Error in /api/scholarships:", err);
    return NextResponse.json(
      {
        success: false,
        error: "স্কলারশিপ তালিকা লোড করতে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
