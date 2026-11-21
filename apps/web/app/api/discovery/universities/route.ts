import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";
import { universityFilterSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const filter = universityFilterSchema.parse(query);

    const whereClause: any = {};

    if (filter.search) {
      whereClause.OR = [
        { nameEn: { contains: filter.search, mode: "insensitive" } },
        { nameBn: { contains: filter.search, mode: "insensitive" } },
        { city: { contains: filter.search, mode: "insensitive" } },
        { stateOrProvince: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.countryCode) {
      whereClause.countryCode = filter.countryCode;
    }

    if (filter.city) {
      whereClause.city = { contains: filter.city, mode: "insensitive" };
    }

    if (filter.institutionType) {
      whereClause.institutionType = filter.institutionType;
    }

    if (typeof filter.isPublic === "boolean") {
      whereClause.isPublic = filter.isPublic;
    }

    if (filter.verificationStatus) {
      whereClause.verificationStatus = filter.verificationStatus;
    }

    if (filter.minRank || filter.maxRank) {
      whereClause.worldRank = {};
      if (filter.minRank) whereClause.worldRank.gte = filter.minRank;
      if (filter.maxRank) whereClause.worldRank.lte = filter.maxRank;
    }

    // Sorting
    let orderBy: any = {};
    if (filter.sortBy === "worldRank") {
      orderBy = { worldRank: filter.sortOrder };
    } else if (filter.sortBy === "nameEn") {
      orderBy = { nameEn: filter.sortOrder };
    } else if (filter.sortBy === "city") {
      orderBy = { city: filter.sortOrder };
    }

    const skip = (filter.page - 1) * filter.limit;
    const take = filter.limit;

    const [total, universities] = await Promise.all([
      prisma.university.count({ where: whereClause }),
      prisma.university.findMany({
        where: whereClause,
        include: {
          country: {
            select: {
              code: true,
              nameEn: true,
              nameBn: true,
              flagEmoji: true,
              currencyCode: true,
              currencySymbol: true,
              approxBdtRate: true,
            },
          },
          _count: {
            select: {
              programs: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: universities,
      pagination: {
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("University discovery error:", error);
    return NextResponse.json(
      { success: false, error: "বিশ্ববিদ্যালয়ের তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
