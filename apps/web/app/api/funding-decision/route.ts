import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import {
  prisma,
  FundingChoiceType,
  AuditAction,
  IntakeSeason,
} from "@abroadmate/database";
import { submitFundingDecisionSchema } from "@abroadmate/validation";
import {
  calculateFundingImpact,
  getRoadmapTaskTemplatesForFunding,
  mergeTasksWithPreservation,
  ScholarshipRecord,
} from "@abroadmate/scholarship-engine";

export async function GET() {
  try {
    const authSession = await getAuthenticatedUser();
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত ব্যবহারকারী।" },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;

    const [activeDecision, history] = await Promise.all([
      prisma.fundingDecisionLog.findFirst({
        where: { userId, isActive: true },
        include: {
          scholarship: {
            include: { country: true, university: true },
          },
        },
        orderBy: { decidedAt: "desc" },
      }),
      prisma.fundingDecisionLog.findMany({
        where: { userId },
        include: {
          scholarship: true,
        },
        orderBy: { decidedAt: "desc" },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        activeDecision,
        history,
      },
    });
  } catch (err: any) {
    console.error("Error in GET /api/funding-decision:", err);
    return NextResponse.json(
      { success: false, error: "ফান্ডিং সিদ্ধান্তের ইতিহাস লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await getAuthenticatedUser();
    if (!authSession?.user?.id) {
      return NextResponse.json(
        { success: false, error: "অনুগ্রহ করে লগইন করে ফান্ডিং সিদ্ধান্ত নিশ্চিত করুন।" },
        { status: 401 }
      );
    }

    const userId = authSession.user.id;
    const body = await request.json();
    const parseResult = submitFundingDecisionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { choiceType, scholarshipId, targetProgramId, notes } = parseResult.data;

    // Fetch scholarship and program details if provided
    let scholarship: ScholarshipRecord | null = null;
    if (scholarshipId) {
      const sch = await prisma.scholarship.findUnique({
        where: { id: scholarshipId },
        include: { country: true, university: true, eligibilityRules: true },
      });
      if (sch) scholarship = sch as unknown as ScholarshipRecord;
    }

    let program: any = null;
    if (targetProgramId) {
      program = await prisma.program.findUnique({
        where: { id: targetProgramId },
      });
    }

    // Calculate financial impact
    const impact = calculateFundingImpact(
      choiceType as "SCHOLARSHIP_FUNDED" | "SELF_FUNDED",
      scholarship,
      program
    );

    // Database updates in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deactivate existing active decisions
      await tx.fundingDecisionLog.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });

      // 2. Create new active FundingDecisionLog
      const newDecision = await tx.fundingDecisionLog.create({
        data: {
          userId,
          choiceType: choiceType as FundingChoiceType,
          scholarshipId: scholarshipId || null,
          coveredTuitionAmount: impact.coveredTuitionBdt,
          coveredLivingAmount: impact.coveredLivingBdt,
          uncoveredExpensesBdt: impact.uncoveredPersonalBufferBdt,
          currencyCode: "BDT",
          notesBn: notes || impact.summaryBn,
          isActive: true,
        },
      });

      // 3. Update FinancialProfile
      const strategyType =
        choiceType === "SCHOLARSHIP_FUNDED"
          ? scholarship?.fundingType === "FULL_FUNDED"
            ? "FULL_SCHOLARSHIP"
            : "PARTIAL_SCHOLARSHIP"
          : "SELF_AND_FAMILY";

      await tx.financialProfile.upsert({
        where: { profileId: (await tx.studentProfile.findUnique({ where: { userId } }))?.id || "" },
        update: {
          fundingStrategyType: strategyType,
          scholarshipPreference: choiceType === "SCHOLARSHIP_FUNDED" ? "FULL_ONLY" : "NO_NEED",
        },
        create: {
          profileId: (await tx.studentProfile.findUnique({ where: { userId } }))?.id || "",
          annualTuitionBudget: impact.uncoveredPersonalBufferBdt,
          fundingStrategyType: strategyType,
          scholarshipPreference: choiceType === "SCHOLARSHIP_FUNDED" ? "FULL_ONLY" : "NO_NEED",
        },
      });

      // 4. Update Roadmap Tasks with Task Preservation
      let roadmap = await tx.roadmap.findFirst({
        where: { userId },
        include: {
          phases: {
            include: { tasks: true },
          },
        },
      });

      if (!roadmap) {
        roadmap = await tx.roadmap.create({
          data: {
            userId,
            targetCountryCode: scholarship?.countryCode || program?.countryCode || "GB",
            targetIntakeSeason: IntakeSeason.FALL,
            targetIntakeYear: 2026,
            currentStageNumber: 2,
            phases: {
              create: [
                {
                  phaseNumber: 1,
                  titleBn: "প্রোফাইল প্রস্তুতি ও দেশ নির্বাচন",
                  titleEn: "Profile & Country Selection",
                  timeframeNoticeBn: "ইনটেকের ১২-১৫ মাস পূর্বে",
                },
                {
                  phaseNumber: 2,
                  titleBn: "স্কলারশিপ ও ডকুমেন্ট প্রস্তুতি",
                  titleEn: "Scholarship & Document Preparation",
                  timeframeNoticeBn: "ইনটেকের ৯-১২ মাস পূর্বে",
                },
                {
                  phaseNumber: 3,
                  titleBn: "আর্থিক সলভেন্সি ও ভিসা প্রস্তুতি",
                  titleEn: "Financial Solvency & Visa Prep",
                  timeframeNoticeBn: "ইনটেকের ৪-৬ মাস পূর্বে",
                },
              ],
            },
          },
          include: {
            phases: {
              include: { tasks: true },
            },
          },
        });
      }

      // Generate task templates for the chosen funding route
      const taskTemplates = getRoadmapTaskTemplatesForFunding(
        choiceType as any,
        scholarship?.titleBn
      );

      // Collect all existing tasks across all phases to check completed status
      const existingTasks = roadmap.phases.flatMap((p) => p.tasks);
      const mergedTasks = mergeTasksWithPreservation(existingTasks, taskTemplates);

      // Inject merged tasks into appropriate phases (default to phase 2 or 3)
      for (const t of mergedTasks) {
        const targetPhase =
          roadmap.phases.find((p) => p.phaseNumber === t.phaseNumber) || roadmap.phases[0];
        if (targetPhase) {
          const existingTaskInPhase = targetPhase.tasks.find(
            (et) => et.titleBn.trim().toLowerCase() === t.titleBn.trim().toLowerCase()
          );

          if (!existingTaskInPhase) {
            await tx.roadmapTask.create({
              data: {
                phaseId: targetPhase.id,
                titleBn: t.titleBn,
                titleEn: t.titleEn,
                description: t.description,
                actionUrl: t.actionUrl,
                isCompleted: t.isCompleted,
                completedAt: t.completedAt,
              },
            });
          }
        }
      }

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: AuditAction.UPDATE,
          resourceType: "FundingDecision",
          resourceId: newDecision.id,
          changesJson: JSON.stringify({
            choiceType,
            scholarshipId,
            coveredBdt: impact.totalCoveredBdt,
          }),
        },
      });

      return newDecision;
    });

    return NextResponse.json({
      success: true,
      data: {
        decision: result,
        impact,
      },
      message:
        choiceType === "SCHOLARSHIP_FUNDED"
          ? "স্কলারশিপ অর্থায়নের সিদ্ধান্ত সফলভাবে সংরক্ষিত হয়েছে। আপনার রোডম্যাপ ও বাজেট আপডেট করা হয়েছে।"
          : "স্ব-অর্থায়নে পড়ার সিদ্ধান্ত সংরক্ষিত হয়েছে। দূতাবাস ব্যাংক সলভেন্সির টাস্ক রোডম্যাপে যুক্ত করা হয়েছে।",
    });
  } catch (err: any) {
    console.error("Error in POST /api/funding-decision:", err);
    return NextResponse.json(
      {
        success: false,
        error: "ফান্ডিং সিদ্ধান্ত সংরক্ষণে সমস্যা হয়েছে।",
        message: err.message,
      },
      { status: 500 }
    );
  }
}
