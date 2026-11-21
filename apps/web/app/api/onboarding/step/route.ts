import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  basicInfoStepSchema,
  educationStepSchema,
  languageProficiencyStepSchema,
  studyPreferencesStepSchema,
  financialBackgroundStepSchema,
  immigrationHistoryStepSchema,
  calculateProfileCompletion,
} from "@abroadmate/validation";
import { prisma, AppRole, AuditAction } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "অনবোর্ডিং তথ্য সংরক্ষণ করতে লগইন করুন।" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { step, data } = body;

    if (!step || typeof step !== "number" || step < 1 || step > 6) {
      return NextResponse.json(
        { success: false, error: "সঠিক অনবোর্ডিং ধাপ (Step 1-6) নির্দেশ করুন।" },
        { status: 400 }
      );
    }

    // Ensure student profile exists
    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          userId,
          currentLevel: "hsc_passed",
          onboardingStep: 1,
          completionPercentage: 25,
        },
      });
    }

    const profileId = studentProfile.id;

    // Handle each step validation and DB persistence
    switch (step) {
      case 1: {
        const validation = basicInfoStepSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "ধাপ ১ ভ্যালিডেশন ত্রুটি",
              details: validation.error.flatten().fieldErrors,
            },
            { status: 400 }
          );
        }

        const valid = validation.data;

        await prisma.$transaction([
          prisma.user.update({
            where: { id: userId },
            data: {
              fullName: valid.fullName,
              phone: valid.phone,
            },
          }),
          prisma.studentProfile.update({
            where: { id: profileId },
            data: {
              dateOfBirth: new Date(valid.dateOfBirth),
              nationality: valid.nationality,
              currentCountry: valid.currentCountry,
              currentCity: valid.currentCity,
              hasPassport: valid.hasPassport,
              passportNumber: valid.passportNumber || null,
              passportExpiryDate: valid.passportExpiryDate ? new Date(valid.passportExpiryDate) : null,
              alternatePhone: valid.alternatePhone || null,
              onboardingStep: Math.max(studentProfile.onboardingStep, 2),
            },
          }),
        ]);
        break;
      }

      case 2: {
        const validation = educationStepSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "ধাপ ২ ভ্যালিডেশন ত্রুটি",
              details: validation.error.flatten().fieldErrors,
            },
            { status: 400 }
          );
        }

        const valid = validation.data;

        await prisma.$transaction(async (tx) => {
          await tx.studentProfile.update({
            where: { id: profileId },
            data: {
              currentLevel: valid.highestCompletedLevel,
              onboardingStep: Math.max(studentProfile.onboardingStep, 3),
            },
          });

          // Delete previous draft records and recreate cleanly
          await tx.academicRecord.deleteMany({
            where: { profileId },
          });

          for (const rec of valid.academicRecords) {
            await tx.academicRecord.create({
              data: {
                profileId,
                level: rec.level,
                institutionName: rec.institutionName,
                boardOrAuthority: rec.boardOrAuthority || null,
                groupOrMajor: rec.groupOrMajor,
                gpaOrCgpa: rec.gpaOrCgpa,
                scale: rec.scale,
                startYear: rec.startYear || null,
                passingYear: rec.passingYear,
                resultStatus: rec.resultStatus,
                hasBacklogs: rec.hasBacklogs,
                backlogsCount: rec.backlogsCount,
                transcriptDocId: rec.transcriptDocId || null,
                certificateDocId: rec.certificateDocId || null,
              },
            });
          }
        });
        break;
      }

      case 3: {
        const validation = languageProficiencyStepSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "ধাপ ৩ ভ্যালিডেশন ত্রুটি",
              details: validation.error.flatten().fieldErrors,
            },
            { status: 400 }
          );
        }

        const valid = validation.data;

        await prisma.$transaction(async (tx) => {
          await tx.studentProfile.update({
            where: { id: profileId },
            data: {
              onboardingStep: Math.max(studentProfile.onboardingStep, 4),
            },
          });

          await tx.languageTestRecord.deleteMany({
            where: { profileId },
          });

          await tx.languageTestRecord.create({
            data: {
              profileId,
              testType: valid.testType,
              overallScore: valid.overallScore || null,
              listeningScore: valid.listeningScore || null,
              readingScore: valid.readingScore || null,
              writingScore: valid.writingScore || null,
              speakingScore: valid.speakingScore || null,
              testDate: valid.testDate ? new Date(valid.testDate) : null,
              expiryDate: valid.expiryDate ? new Date(valid.expiryDate) : null,
              plannedTestDate: valid.plannedTestDate ? new Date(valid.plannedTestDate) : null,
              trfNumber: valid.trfNumber || null,
              certificateDocId: valid.certificateDocId || null,
            },
          });
        });
        break;
      }

      case 4: {
        const validation = studyPreferencesStepSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "ধাপ ৪ ভ্যালিডেশন ত্রুটি",
              details: validation.error.flatten().fieldErrors,
            },
            { status: 400 }
          );
        }

        const valid = validation.data;

        await prisma.$transaction(async (tx) => {
          await tx.studentProfile.update({
            where: { id: profileId },
            data: {
              targetDegreeLevel: valid.desiredDegreeLevel,
              targetField: valid.preferredSubject,
              targetIntakeSeason: valid.targetIntakeSeason,
              targetIntakeYear: valid.targetIntakeYear,
              onboardingStep: Math.max(studentProfile.onboardingStep, 5),
            },
          });

          await tx.studyPreference.upsert({
            where: { profileId },
            update: {
              desiredDegreeLevel: valid.desiredDegreeLevel,
              preferredSubject: valid.preferredSubject,
              targetCountryCodes: valid.targetCountryCodes,
              preferredIntakeSeason: valid.targetIntakeSeason,
              preferredIntakeYear: valid.targetIntakeYear,
              studyMode: valid.studyMode,
              preferredCityType: valid.preferredCityType,
              pswWorkImportance: valid.pswWorkImportance,
              academicGoals: valid.academicGoals || null,
              careerGoals: valid.careerGoals || null,
            },
            create: {
              profileId,
              desiredDegreeLevel: valid.desiredDegreeLevel,
              preferredSubject: valid.preferredSubject,
              targetCountryCodes: valid.targetCountryCodes,
              preferredIntakeSeason: valid.targetIntakeSeason,
              preferredIntakeYear: valid.targetIntakeYear,
              studyMode: valid.studyMode,
              preferredCityType: valid.preferredCityType,
              pswWorkImportance: valid.pswWorkImportance,
              academicGoals: valid.academicGoals || null,
              careerGoals: valid.careerGoals || null,
            },
          });
        });
        break;
      }

      case 5: {
        const validation = financialBackgroundStepSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "ধাপ ৫ ভ্যালিডেশন ত্রুটি",
              details: validation.error.flatten().fieldErrors,
            },
            { status: 400 }
          );
        }

        const valid = validation.data;

        await prisma.$transaction(async (tx) => {
          await tx.studentProfile.update({
            where: { id: profileId },
            data: {
              onboardingStep: Math.max(studentProfile.onboardingStep, 6),
            },
          });

          const financial = await tx.financialProfile.upsert({
            where: { profileId },
            update: {
              annualTuitionBudget: valid.annualTuitionBudget,
              budgetCurrencyCode: valid.budgetCurrencyCode,
              liquidSavingsAmount: valid.liquidSavingsAmount,
              savingsCurrencyCode: valid.savingsCurrencyCode,
              primaryBankName: valid.primaryBankName || null,
              fundingStrategyType: valid.fundingStrategyType,
              hasSponsor: valid.hasSponsor,
              scholarshipPreference: valid.scholarshipPreference || null,
              educationLoanInterest: valid.educationLoanInterest || null,
            },
            create: {
              profileId,
              annualTuitionBudget: valid.annualTuitionBudget,
              budgetCurrencyCode: valid.budgetCurrencyCode,
              liquidSavingsAmount: valid.liquidSavingsAmount,
              savingsCurrencyCode: valid.savingsCurrencyCode,
              primaryBankName: valid.primaryBankName || null,
              fundingStrategyType: valid.fundingStrategyType,
              hasSponsor: valid.hasSponsor,
              scholarshipPreference: valid.scholarshipPreference || null,
              educationLoanInterest: valid.educationLoanInterest || null,
            },
          });

          if (valid.hasSponsor && valid.sponsorName) {
            await tx.sponsor.deleteMany({
              where: { financialProfileId: financial.id },
            });

            await tx.sponsor.create({
              data: {
                financialProfileId: financial.id,
                relationship: valid.sponsorRelationship,
                name: valid.sponsorName,
                occupation: valid.sponsorOccupation || null,
                annualIncomeAmount: valid.annualSponsorIncome || null,
                incomeCurrencyCode: valid.savingsCurrencyCode,
              },
            });
          }
        });
        break;
      }

      case 6: {
        const validation = immigrationHistoryStepSchema.safeParse(data);
        if (!validation.success) {
          return NextResponse.json(
            {
              success: false,
              error: "ধাপ ৬ ভ্যালিডেশন ত্রুটি",
              details: validation.error.flatten().fieldErrors,
            },
            { status: 400 }
          );
        }

        const valid = validation.data;

        await prisma.$transaction(async (tx) => {
          await tx.studentProfile.update({
            where: { id: profileId },
            data: {
              onboardingStep: Math.max(studentProfile.onboardingStep, 7),
            },
          });

          await tx.immigrationHistory.deleteMany({
            where: { profileId },
          });

          await tx.immigrationHistory.create({
            data: {
              profileId,
              hasTravelHistory: valid.hasTravelHistory,
              travelHistorySummary: valid.travelHistorySummary || null,
              countryCode: valid.countryCode || "NONE",
              visaTypeApplied: valid.visaTypeApplied || null,
              applicationYear: valid.applicationYear || null,
              outcomeStatus: valid.outcomeStatus,
              hasPreviousRefusal: valid.hasPreviousRefusal,
              refusalReasonNotice: valid.refusalReasonNotice || null,
              hasViolations: valid.hasViolations,
              violationDetails: valid.violationDetails || null,
            },
          });
        });
        break;
      }
    }

    // Recalculate completion score
    const updatedProfile = await prisma.studentProfile.findUnique({
      where: { id: profileId },
      include: {
        academicRecords: true,
        languageTests: true,
        financialProfile: true,
        immigrationHistory: true,
        studyPreference: true,
      },
    });

    const completion = calculateProfileCompletion({
      basicInfo: {
        fullName: session.user.fullName,
        dateOfBirth: updatedProfile?.dateOfBirth?.toISOString(),
        currentCity: updatedProfile?.currentCity || undefined,
        hasPassport: updatedProfile?.hasPassport,
        passportExpiryDate: updatedProfile?.passportExpiryDate?.toISOString(),
      },
      education: {
        highestCompletedLevel: (updatedProfile?.currentLevel as any) || undefined,
        academicRecords: updatedProfile?.academicRecords as any,
      },
      language: {
        hasTakenTest: updatedProfile?.languageTests?.[0]?.testType !== "NOT_TAKEN",
        overallScore: updatedProfile?.languageTests?.[0]?.overallScore || undefined,
        plannedTestDate: updatedProfile?.languageTests?.[0]?.plannedTestDate?.toISOString(),
      },
      preferences: {
        targetCountryCodes: updatedProfile?.studyPreference?.targetCountryCodes || undefined,
        preferredSubject: updatedProfile?.targetField || undefined,
        careerGoals: updatedProfile?.studyPreference?.careerGoals || undefined,
      },
      financial: {
        annualTuitionBudget: updatedProfile?.financialProfile?.annualTuitionBudget,
        hasSponsor: updatedProfile?.financialProfile?.hasSponsor,
        liquidSavingsAmount: updatedProfile?.financialProfile?.liquidSavingsAmount,
      },
      immigration: {
        hasTravelHistory: updatedProfile?.immigrationHistory?.[0]?.hasTravelHistory,
      },
    });

    await prisma.studentProfile.update({
      where: { id: profileId },
      data: {
        completionPercentage: completion.percentage,
      },
    });

    return NextResponse.json({
      success: true,
      message: `ধাপ ${step} সফলভাবে সংরক্ষিত হয়েছে!`,
      data: {
        nextStep: Math.min(7, step + 1),
        completionPercentage: completion.percentage,
        completion,
      },
    });
  } catch (error: any) {
    console.error("Save onboarding step error:", error);
    return NextResponse.json(
      { success: false, error: "ধাপ সংরক্ষণ করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
