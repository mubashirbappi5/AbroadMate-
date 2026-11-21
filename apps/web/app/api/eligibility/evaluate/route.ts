import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import {
  EvaluateEligibilityInputSchema,
  StudentAcademicRecordInput,
  StudentLanguageTestInput,
} from "@abroadmate/validation";
import {
  evaluateProgramEligibility,
  DeterministicEvaluationInput,
} from "@abroadmate/eligibility-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = EvaluateEligibilityInputSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইনপুট ফরম্যাট। দয়া করে সকল তথ্য সঠিকভাবে পূরণ করুন।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    // 1. Fetch Program & Verified Requirements from DB
    const program = await prisma.program.findUnique({
      where: { id: input.programId },
      include: {
        university: {
          include: {
            country: true,
          },
        },
        admissionRequirements: true,
        intakes: true,
      },
    });

    if (!program || !program.admissionRequirements) {
      return NextResponse.json(
        {
          success: false,
          error: "নির্বাচিত প্রোগ্রামের অফিসিয়াল অ্যাডমিশন রিকোয়ারমেন্ট ডেটাবেজে খুঁজে পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    const req = program.admissionRequirements;

    // 2. Resolve Intake
    let targetIntake = program.intakes[0];
    if (input.intakeId) {
      targetIntake = program.intakes.find((i) => i.id === input.intakeId) || targetIntake;
    } else if (input.intakeSeason && input.intakeYear) {
      targetIntake =
        program.intakes.find(
          (i) => i.season === input.intakeSeason && i.year === input.intakeYear
        ) || targetIntake;
    }

    // 3. Resolve Student Profile (from manual input or authenticated database profile)
    let academicRecord: StudentAcademicRecordInput | undefined = input.academicRecord;
    let languageTest: StudentLanguageTestInput | undefined = input.languageTest;
    let workMonths = input.workExperienceMonths || 0;
    let workField = input.workExperienceField;

    // If manual input is not fully supplied, attempt to prefill from authenticated profile
    const authSession = await getAuthenticatedUser();
    if (authSession?.user?.id && (!academicRecord || !languageTest)) {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: authSession.user.id },
        include: {
          academicRecords: {
            orderBy: { passingYear: "desc" },
          },
          languageTests: {
            orderBy: { createdAt: "desc" },
          },
          employmentRecords: true,
        },
      });

      if (profile) {
        // Fallback academic record from DB if not manually overridden
        if (!academicRecord && profile.academicRecords.length > 0) {
          const topRecord = profile.academicRecords[0];
          if (topRecord) {
            academicRecord = {
              degreeLevel: topRecord.level as any,
              institution: topRecord.institutionName,
              discipline: topRecord.groupOrMajor || "General",
              gpa: topRecord.gpaOrCgpa,
              scale: topRecord.scale || 4.0,
              passingYear: topRecord.passingYear,
              resultStatus: topRecord.resultStatus as any,
            };
          }
        }

        // Fallback language test from DB if not manually overridden
        if (!languageTest && profile.languageTests.length > 0) {
          const topTest = profile.languageTests[0];
          if (topTest) {
            languageTest = {
              testType: topTest.testType as any,
              overallScore: topTest.overallScore || 0,
              listening: topTest.listeningScore || undefined,
              reading: topTest.readingScore || undefined,
              writing: topTest.writingScore || undefined,
              speaking: topTest.speakingScore || undefined,
              testDate: topTest.testDate?.toISOString(),
              isPlannedOnly: topTest.overallScore === null || topTest.overallScore === 0,
            };
          }
        }

        // Fallback work experience months
        if (workMonths === 0 && profile.employmentRecords.length > 0) {
          workMonths = profile.employmentRecords.reduce((acc, job) => {
            const start = new Date(job.startDate);
            const end = job.endDate ? new Date(job.endDate) : new Date();
            const months = Math.max(
              0,
              (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
            );
            return acc + months;
          }, 0);
          workField = profile.employmentRecords[0]?.designation;
        }
      }
    }

    // 4. Construct Deterministic Input for Rule Engine
    const engineInput: DeterministicEvaluationInput = {
      program: {
        id: program.id,
        titleEn: program.titleEn,
        titleBn: program.titleBn,
        universityId: program.university.id,
        universityNameEn: program.university.nameEn,
        universityNameBn: program.university.nameBn,
        countryCode: program.university.countryCode,
        officialAdmissionsUrl:
          program.officialProgramUrl ||
          program.university.admissionsUrl ||
          program.officialSourceUrl,
      },
      requirement: {
        requiredDegreeLevel: req.requiredDegreeLevel as string,
        acceptedQualifications: req.acceptedQualifications || [],
        requiredDisciplines: req.requiredDisciplines || [],
        minGpaOrCgpa: req.minGpaOrCgpa,
        gpaScale: req.gpaScale,
        minPercentage: req.minPercentage,
        minUkDegreeClassification: req.minUkDegreeClassification,
        maxGermanGrade: req.maxGermanGrade,
        countryCode: program.university.countryCode,
        minIeltsOverall: req.minIeltsOverall,
        minIeltsEachBand: req.minIeltsEachBand,
        minIeltsListening: req.minIeltsListening,
        minIeltsReading: req.minIeltsReading,
        minIeltsWriting: req.minIeltsWriting,
        minIeltsSpeaking: req.minIeltsSpeaking,
        minPteOverall: req.minPteOverall,
        minPteEachBand: req.minPteEachBand,
        minToeflIbtOverall: req.minToeflIbtOverall,
        minToeflEachBand: req.minToeflEachBand,
        duolingoAccepted: req.duolingoAccepted,
        minDuolingoScore: req.minDuolingoScore,
        allowsConditionalAdmission: req.allowsConditionalAdmission,
        preSessionalEnglishAvailable: req.preSessionalEnglishAvailable,
        workExperienceMonths: req.workExperienceMonths,
        workExperienceRequired: req.workExperienceRequired,
        workExperienceField: req.workExperienceField,
        greRequired: req.greRequired,
        minGreOverall: req.minGreScore,
        minGreQuant: req.minGreQuant,
        minGreVerbal: req.minGreVerbal,
        gmatRequired: req.gmatRequired,
        minGmatScore: req.minGmatScore,
        portfolioRequired: req.portfolioRequired,
        officialSourceUrl: req.officialSourceUrl,
        requirementVersion: req.version,
      },
      intake: targetIntake
        ? {
            id: targetIntake.id,
            season: targetIntake.season,
            year: targetIntake.year,
            applicationDeadline: targetIntake.applicationDeadline,
            sessionStartDate: targetIntake.sessionStartDate,
            officialSourceUrl: req.officialSourceUrl,
          }
        : undefined,
      student: {
        academicRecord,
        languageTest,
        prerequisites: {
          workExperienceMonths: workMonths,
          workExperienceField: workField,
          greScore: input.greScore,
          gmatScore: input.gmatScore,
          hasPortfolio: input.hasPortfolio,
        },
      },
    };

    // 5. Execute 100% Deterministic Code (Zero LLM)
    const evaluation = evaluateProgramEligibility(engineInput);

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (err: any) {
    console.error("Error in /api/eligibility/evaluate:", err);
    return NextResponse.json(
      {
        success: false,
        error: "যোগ্যতা যাচাইয়ের সময় একটি অভ্যন্তরীণ ত্রুটি ঘটেছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
