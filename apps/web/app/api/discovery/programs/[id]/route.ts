import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const program = await prisma.program.findUnique({
      where: { id },
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

    if (!program) {
      return NextResponse.json(
        { success: false, error: "প্রোগ্রামটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const bdtRate = program.university?.country?.approxBdtRate || 1.0;
    const approxTuitionBdt = Math.round(program.annualTuitionAmount * bdtRate);

    return NextResponse.json({
      success: true,
      data: {
        ...program,
        approxTuitionBdt,
      },
    });
  } catch (error: any) {
    console.error("Program detail error:", error);
    return NextResponse.json(
      { success: false, error: "প্রোগ্রামের বিস্তারিত তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
