import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        country: true,
        programs: {
          include: {
            admissionRequirements: true,
            intakes: {
              orderBy: { year: "asc" },
            },
          },
          orderBy: { degreeLevel: "asc" },
        },
        sources: {
          include: {
            records: {
              take: 1,
              orderBy: { scrapedAt: "desc" },
            },
          },
        },
      },
    });

    if (!university) {
      return NextResponse.json(
        { success: false, error: "বিশ্ববিদ্যালয়টি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: university,
    });
  } catch (error: any) {
    console.error("University detail error:", error);
    return NextResponse.json(
      { success: false, error: "বিশ্ববিদ্যালয়ের বিস্তারিত লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
