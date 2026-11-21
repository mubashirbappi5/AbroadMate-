import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "অনবোর্ডিং তথ্য দেখতে লগইন করুন।" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Load complete student profile with relations
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        academicRecords: {
          orderBy: { passingYear: "desc" },
        },
        languageTests: true,
        financialProfile: {
          include: {
            sponsors: true,
          },
        },
        immigrationHistory: true,
        studyPreference: true,
      },
    });

    const userDocs = await prisma.userDocument.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        category: true,
        fileName: true,
        fileSize: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          fullName: session.user.fullName,
          email: session.user.email,
          phone: session.user.phone,
        },
        profile,
        documents: userDocs,
        onboardingStep: profile?.onboardingStep || 1,
        onboardingCompleted: profile?.onboardingCompleted || false,
        completionPercentage: profile?.completionPercentage || 25,
      },
    });
  } catch (error: any) {
    console.error("Get onboarding error:", error);
    return NextResponse.json(
      { success: false, error: "অনবোর্ডিং ড্রাফট লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
