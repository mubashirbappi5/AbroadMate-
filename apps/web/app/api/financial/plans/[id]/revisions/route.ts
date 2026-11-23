import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "লগইন করা আবশ্যক।" }, { status: 401 });
    }

    const { id } = await params;

    const plan = await prisma.budgetPlan.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!plan || plan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "বাজেট প্ল্যান পাওয়া যায়নি বা অ্যাক্সেস নেই।" },
        { status: 404 }
      );
    }

    const revisions = await prisma.budgetPlanRevision.findMany({
      where: { planId: id },
      orderBy: { versionNumber: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: revisions,
    });
  } catch (error) {
    console.error("Failed to fetch plan revisions:", error);
    return NextResponse.json(
      { error: "রিভিশন হিস্ট্রি লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
