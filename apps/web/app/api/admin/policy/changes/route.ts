import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  ReviewStatus,
} from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
      AppRole.SUPPORT_ADMIN,
      AppRole.CONTENT_MANAGER,
    ]);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ReviewStatus | null;

    const where: any = {};
    if (status) {
      where.approvalStatus = status;
    }

    const approvals = await prisma.policyChangeApproval.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        version: {
          include: {
            visaRequirement: {
              include: {
                country: true,
                visaType: true,
              },
            },
          },
        },
        proposedByUser: {
          select: { id: true, fullName: true, email: true },
        },
        approvedByUser: {
          select: { id: true, fullName: true, email: true },
        },
      },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: approvals,
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "পলিসি চেঞ্জ তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
