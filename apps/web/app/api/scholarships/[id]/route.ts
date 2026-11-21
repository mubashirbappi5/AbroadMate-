import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: {
        country: true,
        university: true,
        eligibilityRules: true,
      },
    });

    if (!scholarship) {
      return NextResponse.json(
        { success: false, error: "স্কলারশিপটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scholarship,
    });
  } catch (err: any) {
    console.error("Error in /api/scholarships/[id]:", err);
    return NextResponse.json(
      { success: false, error: "স্কলারশিপের বিস্তারিত লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
