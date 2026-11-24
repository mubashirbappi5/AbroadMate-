import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@abroadmate/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma, AppRole, AuditAction } from "@abroadmate/database";
import { hashPassword, signSessionToken } from "@/lib/auth/password";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

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

    const { fullName, email, phone, password, targetIntakeSeason, targetIntakeYear } = validation.data;

    // 1. Check if user already exists in PostgreSQL
    const existingDbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingDbUser) {
      return NextResponse.json(
        {
          success: false,
          error: "এই ইমেইল দিয়ে ইতোমধ্যে একটি একাউন্ট খোলা রয়েছে। লগইন করার চেষ্টা করুন।",
        },
        { status: 409 }
      );
    }

    // 2. Hash password securely using scrypt with a unique salt
    const passwordHash = await hashPassword(password);

    // 3. Attempt Supabase Auth registration as secondary if configured
    let supabaseId: string | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
          },
        },
      });
      if (authData?.user) {
        supabaseId = authData.user.id;
      }
    } catch {
      // Supabase is optional / mock - proceed with PostgreSQL directly
    }

    // 4. Create user and profile in PostgreSQL within a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          supabaseId: supabaseId || undefined,
          email,
          fullName,
          phone: phone || null,
          passwordHash,
          primaryRole: AppRole.STUDENT,
          roles: {
            create: {
              role: AppRole.STUDENT,
            },
          },
          settings: {
            create: {
              preferredLang: "BN",
              currencyPreference: "BDT",
            },
          },
          consents: {
            create: {
              consentType: "NON_AGENCY_ETHICAL_TERMS",
              consentVersion: "v1.0",
              ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
              userAgent: request.headers.get("user-agent") || "unknown",
            },
          },
          studentProfile: {
            create: {
              currentLevel: "hsc_passed",
              targetIntakeSeason: targetIntakeSeason as any,
              targetIntakeYear,
              completionPercentage: 25,
            },
          },
        },
      });

      // Audit log entry
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: AuditAction.CREATE,
          resourceType: "USER",
          resourceId: user.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
          changesJson: JSON.stringify({ email, fullName, role: "STUDENT" }),
        },
      });

      return user;
    });

    // 5. Issue secure signed session token
    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.primaryRole,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "একাউন্ট সফলভাবে তৈরি হয়েছে!",
        data: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.primaryRole,
        },
      },
      { status: 201 }
    );

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
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
