import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { reviewConfirmationSchema } from "@abroadmate/validation";
import { prisma, AuditAction } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "অনবোর্ডিং সম্পন্ন করতে লগইন আবশ্যক।" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const validation = reviewConfirmationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "অনুগ্রহ করে তথ্যের সত্যতা স্বীকার ও নিশ্চিত করুন।",
        },
        { status: 400 }
      );
    }

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        academicRecords: true,
      },
    });

    if (!studentProfile) {
      return NextResponse.json(
        { success: false, error: "শিক্ষার্থী প্রোফাইল খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Verify minimum required fields before activating
    if (studentProfile.academicRecords.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "অনবোর্ডিং সম্পন্ন করতে কমপক্ষে একটি শিক্ষাগত যোগ্যতা রেকর্ড প্রদান আবশ্যক।",
        },
        { status: 400 }
      );
    }

    // Mark completed in database
    await prisma.$transaction([
      prisma.studentProfile.update({
        where: { id: studentProfile.id },
        data: {
          onboardingStep: 7,
          onboardingCompleted: true,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: AuditAction.UPDATE,
          resourceType: "STUDENT_PROFILE",
          resourceId: studentProfile.id,
          ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: request.headers.get("user-agent"),
          changesJson: JSON.stringify({ onboardingCompleted: true }),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "অভিনন্দন! আপনার স্টাডি অ্যাব্রড প্রোফাইল সফলভাবে তৈরি হয়েছে।",
      data: {
        redirectUrl: "/dashboard",
      },
    });
  } catch (error: any) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      { success: false, error: "অনবোর্ডিং সম্পন্ন করার সময় ত্রুটি দেখা দিয়েছে।" },
      { status: 500 }
    );
  }
}
