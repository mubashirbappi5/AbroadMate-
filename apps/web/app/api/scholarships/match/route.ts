import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma, VerificationStatus } from "@abroadmate/database";
import {
  evaluateScholarshipBatch,
  StudentScholarshipProfileInput,
  ScholarshipRecord,
} from "@abroadmate/scholarship-engine";

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if fetching automatic match
    }

    const authSession = await getAuthenticatedUser();
    let studentInput: StudentScholarshipProfileInput = {
      nationality: body.nationality || "BD",
      degreeLevel: body.degreeLevel || "MASTER",
      discipline: body.discipline,
      cgpa: body.cgpa,
      scale: body.scale || 4.0,
      ieltsOverall: body.ieltsOverall,
      ieltsWriting: body.ieltsWriting,
      workExperienceMonths: body.workExperienceMonths || 0,
      isLanguagePlannedOnly: body.isLanguagePlannedOnly || false,
    };

    // Auto-load from DB if user is logged in
    if (authSession?.user?.id) {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: authSession.user.id },
        include: {
          academicRecords: { orderBy: { passingYear: "desc" } },
          languageTests: { orderBy: { createdAt: "desc" } },
          employmentRecords: true,
        },
      });

      if (profile) {
        studentInput.nationality = profile.nationality || studentInput.nationality;
        studentInput.degreeLevel = (profile.targetDegreeLevel as string) || studentInput.degreeLevel;

        if (profile.academicRecords.length > 0 && !body.cgpa) {
          const topRec = profile.academicRecords[0];
          if (topRec) {
            studentInput.cgpa = topRec.gpaOrCgpa;
            studentInput.scale = topRec.scale || 4.0;
            studentInput.discipline = topRec.groupOrMajor || studentInput.discipline;
          }
        }

        if (profile.languageTests.length > 0 && !body.ieltsOverall) {
          const topTest = profile.languageTests[0];
          if (topTest) {
            studentInput.ieltsOverall = topTest.overallScore || 0;
            studentInput.ieltsWriting = topTest.writingScore || undefined;
            studentInput.isLanguagePlannedOnly =
              !topTest.overallScore || topTest.overallScore === 0;
          }
        }

        if (profile.employmentRecords.length > 0 && !body.workExperienceMonths) {
          studentInput.workExperienceMonths = profile.employmentRecords.reduce((acc, job) => {
            const start = new Date(job.startDate);
            const end = job.endDate ? new Date(job.endDate) : new Date();
            const months = Math.max(
              0,
              (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
            );
            return acc + months;
          }, 0);
        }
      }
    }

    // Fetch verified scholarships from DB
    const scholarships = await prisma.scholarship.findMany({
      where: { verificationStatus: VerificationStatus.VERIFIED },
      include: {
        country: true,
        university: true,
        eligibilityRules: true,
      },
    });

    // Run deterministic rule matching
    const evaluations = evaluateScholarshipBatch(
      studentInput,
      scholarships as unknown as ScholarshipRecord[]
    );

    return NextResponse.json({
      success: true,
      data: {
        totalEvaluated: scholarships.length,
        evaluations,
        studentProfileUsed: studentInput,
      },
    });
  } catch (err: any) {
    console.error("Error in /api/scholarships/match:", err);
    return NextResponse.json(
      {
        success: false,
        error: "স্কলারশিপ ম্যাচিং সম্পন্ন করতে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
