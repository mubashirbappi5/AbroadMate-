import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";
import { programFilterSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const filter = programFilterSchema.parse(query);

    const whereClause: any = {};

    if (filter.search) {
      whereClause.OR = [
        { titleEn: { contains: filter.search, mode: "insensitive" } },
        { titleBn: { contains: filter.search, mode: "insensitive" } },
        { department: { contains: filter.search, mode: "insensitive" } },
        { university: { nameEn: { contains: filter.search, mode: "insensitive" } } },
      ];
    }

    if (filter.universityId) {
      whereClause.universityId = filter.universityId;
    }

    if (filter.countryCode) {
      whereClause.university = {
        ...whereClause.university,
        countryCode: filter.countryCode,
      };
    }

    if (filter.degreeLevel) {
      whereClause.degreeLevel = filter.degreeLevel;
    }

    if (filter.subjectCategory) {
      whereClause.subjectCategory = filter.subjectCategory;
    }

    if (filter.studyMode) {
      whereClause.studyMode = filter.studyMode;
    }

    if (filter.maxIelts) {
      whereClause.admissionRequirements = {
        minIeltsOverall: { lte: filter.maxIelts },
      };
    }

    if (filter.intakeSeason || filter.intakeYear) {
      whereClause.intakes = {
        some: {
          ...(filter.intakeSeason ? { season: filter.intakeSeason } : {}),
          ...(filter.intakeYear ? { year: filter.intakeYear } : {}),
        },
      };
    }

    let orderBy: any = {};
    if (filter.sortBy === "tuition") {
      orderBy = { annualTuitionAmount: filter.sortOrder };
    } else if (filter.sortBy === "duration") {
      orderBy = { durationMonths: filter.sortOrder };
    } else if (filter.sortBy === "title") {
      orderBy = { titleEn: filter.sortOrder };
    }

    const skip = (filter.page - 1) * filter.limit;
    const take = filter.limit;

    const [total, programs] = await Promise.all([
      prisma.program.count({ where: whereClause }),
      prisma.program.findMany({
        where: whereClause,
        include: {
          university: {
            include: {
              country: true,
            },
          },
          admissionRequirements: true,
          intakes: {
            orderBy: { year: "asc" },
          },
        },
        orderBy,
        skip,
        take,
      }),
    ]);

    // Enhance with live converted BDT tuition
    const enhancedPrograms = programs.map((p) => {
      const bdtRate = p.university?.country?.approxBdtRate || 1.0;
      const approxTuitionBdt = Math.round(p.annualTuitionAmount * bdtRate);
      return {
        ...p,
        approxTuitionBdt,
      };
    });

    // If budget filter is provided in BDT, filter program list
    let filteredPrograms = enhancedPrograms;
    if (filter.minTuitionBdt !== undefined) {
      filteredPrograms = filteredPrograms.filter((p) => p.approxTuitionBdt >= (filter.minTuitionBdt || 0));
    }
    if (filter.maxTuitionBdt !== undefined) {
      filteredPrograms = filteredPrograms.filter((p) => p.approxTuitionBdt <= (filter.maxTuitionBdt || Infinity));
    }

    return NextResponse.json({
      success: true,
      data: filteredPrograms,
      pagination: {
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages: Math.ceil(total / filter.limit) || 1,
      },
    });
  } catch (error: any) {
    console.error("Program discovery error:", error);
    return NextResponse.json(
      { success: false, error: "প্রোগ্রামের তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
