import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { calculateDeadlineAlerts } from "@abroadmate/roadmap-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const userId = session?.user?.id;

    const deadlines = await prisma.deadline.findMany({
      where: {
        isCompleted: false,
        OR: [
          { isGlobal: true },
          ...(userId ? [{ userId }] : []),
        ],
      },
      select: {
        id: true,
        titleBn: true,
        deadlineDate: true,
        isCompleted: true,
      },
    });

    const alerts = calculateDeadlineAlerts(deadlines);

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
    });
  } catch (error: any) {
    console.error("Fetch deadline alerts error:", error);
    return NextResponse.json(
      { error: "ডেডলাইন অ্যালার্ট হিসেব করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
