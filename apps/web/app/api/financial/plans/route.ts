import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { saveBudgetPlanSchema } from "@abroadmate/validation";
import { calculateFullBudgetPlan } from "@abroadmate/shared";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "বাজেট প্ল্যান সংরক্ষণ ও দেখতে লগইন করুন।",
      });
    }

    const plans = await prisma.budgetPlan.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      include: {
        program: {
          select: {
            titleEn: true,
            titleBn: true,
            university: {
              select: {
                nameEn: true,
                nameBn: true,
              },
            },
          },
        },
        _count: {
          select: { revisions: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Failed to fetch budget plans:", error);
    return NextResponse.json(
      { error: "বাজেট প্ল্যান লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "বাজেট সংরক্ষণ করতে লগইন করা আবশ্যক।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = saveBudgetPlanSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Run deterministic calculation to compute exact aggregates
    const computed = calculateFullBudgetPlan({
      countryCode: data.countryCode,
      degreeLevel: data.degreeLevel,
      studyDurationYears: data.studyDurationYears,
      grossTuitionAnnualLocal: data.grossTuitionAnnualLocal,
      tuitionDepositPaidLocal: data.tuitionDepositPaidLocal,
      scholarshipDeductionLocal: data.scholarshipDeductionLocal,
      studentSavingsLocal: data.studentSavingsLocal,
      sponsorContributionLocal: data.sponsorContributionLocal,
      educationLoanLocal: data.educationLoanLocal,
      monthlySavingsCapacityBdt: data.monthlySavingsCapacityBdt,
      monthsUntilDeparture: data.monthsUntilDeparture,
    });

    const result = await prisma.$transaction(async (tx) => {
      let plan;
      let nextVersion = 1;

      if (data.id) {
        const existing = await tx.budgetPlan.findUnique({
          where: { id: data.id },
        });

        if (existing) {
          nextVersion = existing.versionNumber + 1;
          plan = await tx.budgetPlan.update({
            where: { id: data.id },
            data: {
              title: data.title,
              countryCode: data.countryCode,
              programId: data.programId || null,
              degreeLevel: data.degreeLevel,
              studyDurationYears: data.studyDurationYears,
              currencyCode: computed.currencyCode,
              exchangeRateToBdt: computed.exchangeRateToBdt,
              exchangeRateSource: computed.exchangeRateSource,
              exchangeRateTimestamp: new Date(),
              appFeeTotalLocal: data.appFeeTotalLocal,
              languageTestFeeBdt: data.languageTestFeeBdt,
              documentPrepFeeBdt: data.documentPrepFeeBdt,
              medicalExamFeeBdt: data.medicalExamFeeBdt,
              flightTicketBdt: data.flightTicketBdt,
              initialSettlementLocal: data.initialSettlementLocal,
              visaApplicationFeeLocal: data.visaApplicationFeeLocal,
              biometricsFeeLocal: data.biometricsFeeLocal,
              healthInsuranceLocal: data.healthInsuranceLocal,
              countrySpecificCostsLocal: data.countrySpecificCostsLocal,
              grossTuitionAnnualLocal: data.grossTuitionAnnualLocal,
              tuitionDepositPaidLocal: data.tuitionDepositPaidLocal,
              livingCostAnnualLocal: data.livingCostAnnualLocal,
              accommodationAnnualLocal: data.accommodationAnnualLocal,
              foodAnnualLocal: data.foodAnnualLocal,
              transportAnnualLocal: data.transportAnnualLocal,
              emergencyFundLocal: data.emergencyFundLocal,
              studentSavingsLocal: data.studentSavingsLocal,
              sponsorContributionLocal: data.sponsorContributionLocal,
              educationLoanLocal: data.educationLoanLocal,
              scholarshipDeductionLocal: data.scholarshipDeductionLocal,
              monthlySavingsCapacityBdt: data.monthlySavingsCapacityBdt,
              monthsUntilDeparture: data.monthsUntilDeparture,
              firstYearTotalCostLocal: computed.firstYearTotalCostLocal,
              firstYearTotalCostBdt: computed.firstYearTotalCostBdt,
              totalDegreeCostLocal: computed.totalDegreeCostLocal,
              totalDegreeCostBdt: computed.totalDegreeCostBdt,
              totalAvailableFundsLocal: computed.totalAvailableFundsLocal,
              totalAvailableFundsBdt: computed.totalAvailableFundsBdt,
              fundingGapLocal: computed.fundingGapLocal,
              fundingGapBdt: computed.fundingGapBdt,
              targetMonthlySavingsBdt: computed.targetMonthlySavingsBdt,
              savingsFeasibility: computed.savingsFeasibility,
              versionNumber: nextVersion,
              revisionNotes: data.revisionNotes || null,
            },
          });
        }
      }

      if (!plan) {
        plan = await tx.budgetPlan.create({
          data: {
            userId: session.user.id,
            title: data.title,
            countryCode: data.countryCode,
            programId: data.programId || null,
            degreeLevel: data.degreeLevel,
            studyDurationYears: data.studyDurationYears,
            currencyCode: computed.currencyCode,
            exchangeRateToBdt: computed.exchangeRateToBdt,
            exchangeRateSource: computed.exchangeRateSource,
            exchangeRateTimestamp: new Date(),
            appFeeTotalLocal: data.appFeeTotalLocal,
            languageTestFeeBdt: data.languageTestFeeBdt,
            documentPrepFeeBdt: data.documentPrepFeeBdt,
            medicalExamFeeBdt: data.medicalExamFeeBdt,
            flightTicketBdt: data.flightTicketBdt,
            initialSettlementLocal: data.initialSettlementLocal,
            visaApplicationFeeLocal: data.visaApplicationFeeLocal,
            biometricsFeeLocal: data.biometricsFeeLocal,
            healthInsuranceLocal: data.healthInsuranceLocal,
            countrySpecificCostsLocal: data.countrySpecificCostsLocal,
            grossTuitionAnnualLocal: data.grossTuitionAnnualLocal,
            tuitionDepositPaidLocal: data.tuitionDepositPaidLocal,
            livingCostAnnualLocal: data.livingCostAnnualLocal,
            accommodationAnnualLocal: data.accommodationAnnualLocal,
            foodAnnualLocal: data.foodAnnualLocal,
            transportAnnualLocal: data.transportAnnualLocal,
            emergencyFundLocal: data.emergencyFundLocal,
            studentSavingsLocal: data.studentSavingsLocal,
            sponsorContributionLocal: data.sponsorContributionLocal,
            educationLoanLocal: data.educationLoanLocal,
            scholarshipDeductionLocal: data.scholarshipDeductionLocal,
            monthlySavingsCapacityBdt: data.monthlySavingsCapacityBdt,
            monthsUntilDeparture: data.monthsUntilDeparture,
            firstYearTotalCostLocal: computed.firstYearTotalCostLocal,
            firstYearTotalCostBdt: computed.firstYearTotalCostBdt,
            totalDegreeCostLocal: computed.totalDegreeCostLocal,
            totalDegreeCostBdt: computed.totalDegreeCostBdt,
            totalAvailableFundsLocal: computed.totalAvailableFundsLocal,
            totalAvailableFundsBdt: computed.totalAvailableFundsBdt,
            fundingGapLocal: computed.fundingGapLocal,
            fundingGapBdt: computed.fundingGapBdt,
            targetMonthlySavingsBdt: computed.targetMonthlySavingsBdt,
            savingsFeasibility: computed.savingsFeasibility,
            versionNumber: 1,
            revisionNotes: data.revisionNotes || "প্রাথমিক সংস্করণ",
          },
        });
      }

      // Record immutable snapshot in BudgetPlanRevision
      await tx.budgetPlanRevision.create({
        data: {
          planId: plan.id,
          versionNumber: nextVersion,
          changeSummaryBn: data.revisionNotes || `সংস্করণ ${nextVersion} আপডেট`,
          snapshotJson: JSON.stringify(computed),
          fundingGapBdt: computed.fundingGapBdt,
          firstYearTotalBdt: computed.firstYearTotalCostBdt,
        },
      });

      return plan;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "স্টাডি বাজেট প্ল্যান ও রিভিশন হিস্ট্রি সফলভাবে সংরক্ষিত হয়েছে।",
    });
  } catch (error: any) {
    console.error("Save budget plan failed:", error);
    return NextResponse.json(
      { error: "বাজেট প্ল্যান সংরক্ষণে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
