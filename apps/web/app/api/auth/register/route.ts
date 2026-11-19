import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@abroadmate/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma, AppRole, AuditAction } from "@abroadmate/database";

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

    // Check if user already exists in PostgreSQL
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

    // Call Supabase Auth
    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || null,
        },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: authError?.message || "অথেনটিকেশন সম্পন্ন করা সম্ভব হয়নি",
        },
        { status: 400 }
      );
    }

    // Create user and profile in PostgreSQL within a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          supabaseId: authData.user!.id,
          email,
          fullName,
          phone: phone || null,
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

    return NextResponse.json(
      {
        success: true,
        message: "একাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে আপনার ইমেইল ভেরিফাই করুন।",
        data: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.primaryRole,
        },
      },
      { status: 201 }
    );
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
