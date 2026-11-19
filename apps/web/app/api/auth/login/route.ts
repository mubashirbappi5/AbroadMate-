import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@abroadmate/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma, AuditAction } from "@abroadmate/database";

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
    const supabase = await createServerSupabaseClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইমেইল অথবা পাসওয়ার্ড দেওয়া হয়েছে। আবার চেষ্টা করুন।",
        },
        { status: 401 }
      );
    }

    // Retrieve database user
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: authData.user.id },
      include: {
        roles: true,
        settings: true,
        studentProfile: true,
      },
    });

    if (!dbUser || !dbUser.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "এই একাউন্টটি বর্তমানে স্থগিত অথবা নিষ্ক্রিয় রয়েছে।",
        },
        { status: 403 }
      );
    }

    // Record session metadata & audit log asynchronously
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
          resourceId: authData.user.id,
          ipAddress: ip,
          userAgent,
        },
      }),
    ]);

    return NextResponse.json({
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
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
