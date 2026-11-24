import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@abroadmate/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma, AuditAction } from "@abroadmate/database";
import { verifyPassword, signSessionToken } from "@/lib/auth/password";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভ্যালিডেশন ত্রুটি",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 1. Retrieve user from PostgreSQL
    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
        settings: true,
        studentProfile: true,
      },
    });

    if (!dbUser || !dbUser.isActive || dbUser.deletedAt) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইমেইল অথবা পাসওয়ার্ড দেওয়া হয়েছে। আবার চেষ্টা করুন।",
        },
        { status: 401 }
      );
    }

    let authenticated = false;

    // 2. Direct password verification
    if (dbUser.passwordHash) {
      authenticated = await verifyPassword(password, dbUser.passwordHash);
    }

    // 3. Fallback to Supabase Auth if passwordHash not matched or not set
    if (!authenticated) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!authError && authData.user) {
          authenticated = true;
        }
      } catch {
        // Supabase offline/mock
      }
    }

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইমেইল অথবা পাসওয়ার্ড দেওয়া হয়েছে। আবার চেষ্টা করুন।",
        },
        { status: 401 }
      );
    }

    // 4. Record session metadata & audit log asynchronously
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent");

    await prisma.$transaction([
      prisma.userSessionMetadata.create({
        data: {
          userId: dbUser.id,
          ipAddress: ip,
          userAgent: userAgent || "Unknown",
          deviceType: "desktop",
          lastActiveAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: dbUser.id,
          action: AuditAction.LOGIN,
          resourceType: "SESSION",
          resourceId: dbUser.id,
          ipAddress: ip,
          userAgent,
        },
      }),
    ]);

    // 5. Issue signed session token
    const token = signSessionToken({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.primaryRole,
    });

    const response = NextResponse.json({
      success: true,
      message: "সফলভাবে লগইন হয়েছে!",
      data: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        primaryRole: dbUser.primaryRole,
        roles: dbUser.roles.map((r) => r.role),
        preferredLang: dbUser.settings?.preferredLang || "BN",
        profileCompleted: dbUser.studentProfile?.completionPercentage || 0,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "লগইন করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।",
      },
      { status: 500 }
    );
  }
}
