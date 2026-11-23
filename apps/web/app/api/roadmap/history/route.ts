import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const roadmap = await prisma.roadmap.findFirst({
      where: { userId: session.user.id },
      select: { id: true, versionNumber: true },
    });

    if (!roadmap) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const histories = await prisma.roadmapVersionHistory.findMany({
      where: { roadmapId: roadmap.id },
      orderBy: { versionNumber: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: histories.map((h) => ({
        id: h.id,
        versionNumber: h.versionNumber,
        changeReasonBn: h.changeReasonBn,
        createdAt: h.createdAt,
      })),
      currentVersion: roadmap.versionNumber,
    });
  } catch (error: any) {
    console.error("Fetch roadmap history error:", error);
    return NextResponse.json(
      { error: "রোডম্যাপ হিস্ট্রি লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
