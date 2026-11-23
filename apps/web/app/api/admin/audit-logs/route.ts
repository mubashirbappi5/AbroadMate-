import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import {
  prisma,
  AppRole,
  AuditAction,
} from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.VERIFICATION_MANAGER,
      AppRole.SUPPORT_ADMIN,
    ]);

    const { searchParams } = new URL(request.url);
    const resourceType = searchParams.get("resourceType");
    const action = searchParams.get("action") as AuditAction | null;
    const userId = searchParams.get("userId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const where: any = {};
    if (resourceType) {
      where.resourceType = resourceType;
    }
    if (action) {
      where.action = action;
    }
    if (userId) {
      where.userId = userId;
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: { id: true, fullName: true, email: true, primaryRole: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        limit,
        offset,
        logs,
      },
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "অডিট লগ লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
