import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAuthenticatedUser, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { prisma, AuditAction } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();

    if (session) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: AuditAction.LOGOUT,
          resourceType: "SESSION",
          resourceId: session.user.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
        },
      });
    }

    try {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase is optional / mock
    }

    const response = NextResponse.json({
      success: true,
      message: "সফলভাবে লগআউট করা হয়েছে।",
    });

    // Clear session cookie
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
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
