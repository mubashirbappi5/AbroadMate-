import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";
import { countryFilterSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const filter = countryFilterSchema.parse(query);

    const whereClause: any = {
      isActive: true,
    };

    if (filter.search) {
      whereClause.OR = [
        { nameEn: { contains: filter.search, mode: "insensitive" } },
        { nameBn: { contains: filter.search, mode: "insensitive" } },
        { code: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    if (filter.currency) {
      whereClause.currencyCode = filter.currency.toUpperCase();
    }

    if (typeof filter.blockedAccount === "boolean") {
      whereClause.blockedAccountRequired = filter.blockedAccount;
    }

    const countries = await prisma.country.findMany({
      where: whereClause,
      include: {
        visaTypes: true,
        policyVersions: {
          where: { isArchived: false },
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
        _count: {
          select: {
            universities: true,
            scholarships: true,
          },
        },
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: countries,
      total: countries.length,
    });
  } catch (error: any) {
    console.error("Countries discovery error:", error);
    return NextResponse.json(
      { success: false, error: "দেশের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
