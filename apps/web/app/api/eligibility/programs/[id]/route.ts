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
        admissionRequirements: {
          include: {
            versions: {
              orderBy: { version: "desc" },
              take: 5,
            },
          },
        },
        intakes: {
          orderBy: [{ year: "asc" }, { season: "asc" }],
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, error: "প্রোগ্রামটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      program,
    });
  } catch (err: any) {
    console.error("Error in /api/eligibility/programs/[id]:", err);
    return NextResponse.json(
      { success: false, error: "প্রোগ্রামের তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
