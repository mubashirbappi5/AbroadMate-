import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const countryCode = code.toUpperCase();

    const country = await prisma.country.findUnique({
      where: { code: countryCode },
      include: {
        visaTypes: {
          include: {
            requirements: {
              where: { isCurrentActive: true },
              include: {
                versions: {
                  where: { isArchived: false },
                  include: {
                    financialRules: true,
                    documentRequirements: true,
                  },
                },
              },
            },
          },
        },
        policyVersions: {
          orderBy: { versionNumber: "desc" },
        },
        universities: {
          where: { isRecognized: true },
          take: 6,
          orderBy: { worldRank: "asc" },
          include: {
            programs: {
              take: 3,
            },
          },
        },
        scholarships: {
          take: 5,
        },
        _count: {
          select: {
            universities: true,
            scholarships: true,
          },
        },
      },
    });

    if (!country) {
      return NextResponse.json(
        { success: false, error: "দেশটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: country,
    });
  } catch (error: any) {
    console.error("Country detail error:", error);
    return NextResponse.json(
      { success: false, error: "দেশের বিস্তারিত তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
