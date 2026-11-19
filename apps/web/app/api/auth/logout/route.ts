import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma, AuditAction } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const supabase = await createServerSupabaseClient();

    if (session) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.LOGOUT,
          resourceType: "SESSION",
          resourceId: session.supabaseUser.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
        },
      });
    }

    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "সফলভাবে লগআউট করা হয়েছে।",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "লগআউট করার সময় ত্রুটি দেখা দিয়েছে।",
      },
      { status: 500 }
    );
  }
}
