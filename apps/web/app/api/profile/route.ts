import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma, AuditAction } from "@abroadmate/database";
import {
  calculateProfileCompletion,
  basicInfoStepSchema,
  educationStepSchema,
  languageProficiencyStepSchema,
  studyPreferencesStepSchema,
  financialBackgroundStepSchema,
  immigrationHistoryStepSchema,
} from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "প্রোফাইল দেখতে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    let profile = await prisma.studentProfile.findUnique({
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

    if (!profile) {
      profile = await prisma.studentProfile.create({
        data: {
          userId,
          currentLevel: "bachelor_passed",
          onboardingStep: 1,
          completionPercentage: 25,
        },
        include: {
          academicRecords: true,
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
    }

    const completion = calculateProfileCompletion({
      basicInfo: {
        fullName: session.user.fullName,
        dateOfBirth: profile?.dateOfBirth?.toISOString(),
        currentCity: profile?.currentCity || undefined,
        hasPassport: profile?.hasPassport,
        passportExpiryDate: profile?.passportExpiryDate?.toISOString(),
      },
      education: {
        highestCompletedLevel: (profile?.currentLevel as any) || undefined,
        academicRecords: profile?.academicRecords as any,
      },
      language: {
        hasTakenTest: profile?.languageTests?.[0]?.testType !== "NOT_TAKEN",
        overallScore: profile?.languageTests?.[0]?.overallScore || undefined,
        plannedTestDate: profile?.languageTests?.[0]?.plannedTestDate?.toISOString(),
      },
      preferences: {
        targetCountryCodes: profile?.studyPreference?.targetCountryCodes || undefined,
        preferredSubject: profile?.targetField || undefined,
        careerGoals: profile?.studyPreference?.careerGoals || undefined,
      },
      financial: {
        annualTuitionBudget: profile?.financialProfile?.annualTuitionBudget,
        hasSponsor: profile?.financialProfile?.hasSponsor,
        liquidSavingsAmount: profile?.financialProfile?.liquidSavingsAmount,
      },
      immigration: {
        hasTravelHistory: profile?.immigrationHistory?.[0]?.hasTravelHistory,
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
          role: session.user.primaryRole,
        },
        profile,
        completion,
      },
    });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { success: false, error: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "প্রোফাইল আপডেট করতে লগইন করুন।" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { section, data } = body;

    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          userId,
          currentLevel: "bachelor_passed",
          onboardingStep: 1,
          completionPercentage: 25,
        },
      });
    }

    const profileId = studentProfile.id;

    // Update section based on section name
    if (section === "basicInfo") {
      const validation = basicInfoStepSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "ব্যক্তিগত তথ্য ভ্যালিডেশন ত্রুটি",
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
          },
        }),
      ]);
    } else if (section === "education") {
      const validation = educationStepSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "শিক্ষাগত তথ্য ভ্যালিডেশন ত্রুটি",
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
          },
        });

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
    } else if (section === "language") {
      const validation = languageProficiencyStepSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "ভাষা পরীক্ষার তথ্য ভ্যালিডেশন ত্রুটি",
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      const valid = validation.data;

      await prisma.$transaction(async (tx) => {
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
    } else if (section === "preferences") {
      const validation = studyPreferencesStepSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "পড়াশোনার পছন্দ ভ্যালিডেশন ত্রুটি",
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
    } else if (section === "financial") {
      const validation = financialBackgroundStepSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "আর্থিক তথ্য ভ্যালিডেশন ত্রুটি",
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      const valid = validation.data;

      await prisma.$transaction(async (tx) => {
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
    } else if (section === "immigration") {
      const validation = immigrationHistoryStepSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            error: "ইমিগ্রেশন ইতিহাস ভ্যালিডেশন ত্রুটি",
            details: validation.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
      const valid = validation.data;

      await prisma.$transaction(async (tx) => {
        await tx.immigrationHistory.deleteMany({
          where: { profileId },
        });

        await tx.immigrationHistory.create({
          data: {
            profileId,
            countryCode: "BD",
            hasTravelHistory: valid.hasTravelHistory,
            travelHistorySummary: valid.travelHistorySummary || null,
            outcomeStatus: valid.outcomeStatus,
            hasPreviousRefusal: valid.hasPreviousRefusal,
            refusalReasonNotice: valid.refusalReasonNotice || null,
            hasViolations: valid.hasViolations,
            violationDetails: valid.violationDetails || null,
          },
        });
      });
    }

    // Refresh updated full profile & calculate new score
    const updatedProfile = await prisma.studentProfile.findUnique({
      where: { id: profileId },
      include: {
        academicRecords: { orderBy: { passingYear: "desc" } },
        languageTests: true,
        financialProfile: { include: { sponsors: true } },
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

    // Audit log update
    await prisma.auditLog.create({
      data: {
        userId,
        action: AuditAction.UPDATE,
        resourceType: "STUDENT_PROFILE",
        resourceId: profileId,
        ipAddress: request.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: request.headers.get("user-agent"),
        changesJson: JSON.stringify({ section, completionPercentage: completion.percentage }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "প্রোফাইল সফলভাবে আপডেট হয়েছে!",
      completion,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, error: "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
