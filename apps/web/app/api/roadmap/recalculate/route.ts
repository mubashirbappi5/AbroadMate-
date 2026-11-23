import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { recalculateRoadmapSchema } from "@abroadmate/validation";
import {
  generateIntelligentRoadmap,
  mergeRoadmapTasksWithPreservation,
  RoadmapPhaseDefinition,
} from "@abroadmate/roadmap-engine";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "রোডম্যাপ রিক্যালকুলেট করতে লগইন করা আবশ্যক।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = recalculateRoadmapSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      newCountryCode,
      newIntakeSeason,
      newIntakeYear,
      newUniversityId,
      newProgramId,
      newFundingChoice,
      newScholarshipId,
      changeReasonBn,
    } = parseResult.data;

    const userId = session.user.id;

    // Fetch existing roadmap
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: { userId },
      include: {
        phases: {
          include: {
            tasks: { orderBy: { createdAt: "asc" } },
          },
          orderBy: { phaseNumber: "asc" },
        },
      },
    });

    if (!existingRoadmap) {
      return NextResponse.json(
        { error: "বিদ্যমান কোনো রোডম্যাপ পাওয়া যায়নি। প্রথমে রোডম্যাপ জেনারেট করুন।" },
        { status: 404 }
      );
    }

    // Convert existing DB phases into engine RoadmapPhaseDefinition format
    const oldEnginePhases: RoadmapPhaseDefinition[] = existingRoadmap.phases.map((p) => ({
      phaseNumber: p.phaseNumber,
      phaseKey: p.phaseKey as any,
      titleBn: p.titleBn,
      titleEn: p.titleEn,
      timeframeNoticeBn: p.timeframeNoticeBn,
      isCompleted: p.isCompleted,
      tasks: p.tasks.map((t) => ({
        taskCode: t.taskCode,
        phaseKey: p.phaseKey as any,
        titleBn: t.titleBn,
        titleEn: t.titleEn,
        bengaliExplanation: t.bengaliExplanation || "",
        whyItMattersBn: t.whyItMattersBn || "",
        requiredDocuments: t.requiredDocumentsJson ? JSON.parse(t.requiredDocumentsJson) : [],
        estimatedCostBdt: t.estimatedCostBdt,
        costCurrency: t.costCurrency,
        estimatedDurationDays: t.estimatedDurationDays,
        monthsBeforeIntake: 6,
        priority: t.priority as any,
        status: t.status as any,
        dependencies: t.dependenciesJson ? JSON.parse(t.dependenciesJson) : [],
        officialSourceUrl: t.officialSourceUrl || "",
        officialSourceOrg: t.officialSourceOrg || "",
        completionCriteriaBn: t.completionCriteriaBn || "",
        needsReview: t.needsReview,
        isCompleted: t.isCompleted,
        completedAt: t.completedAt ? t.completedAt.toISOString() : null,
      })),
    }));

    // Generate new blueprint for the new destination and intake
    const newBlueprint = generateIntelligentRoadmap({
      targetCountryCode: newCountryCode,
      targetIntakeSeason: newIntakeSeason,
      targetIntakeYear: newIntakeYear,
      targetUniversityId: newUniversityId,
      targetProgramId: newProgramId,
      fundingChoice: newFundingChoice,
      scholarshipId: newScholarshipId,
    });

    // Merge new blueprint with old roadmap PRESERVING completed tasks
    const { mergedPhases, preservedCount } = mergeRoadmapTasksWithPreservation(
      oldEnginePhases,
      newBlueprint,
      changeReasonBn
    );

    const nextVersion = existingRoadmap.versionNumber + 1;

    // Atomically archive old snapshot and persist newly merged roadmap
    const updatedRoadmap = await prisma.$transaction(async (tx) => {
      // 1. Snapshot previous version
      await tx.roadmapVersionHistory.create({
        data: {
          roadmapId: existingRoadmap.id,
          versionNumber: existingRoadmap.versionNumber,
          changeReasonBn,
          snapshotJson: JSON.stringify(existingRoadmap),
        },
      });

      // 2. Remove old phases & tasks
      await tx.roadmapPhase.deleteMany({
        where: { roadmapId: existingRoadmap.id },
      });

      // 3. Update roadmap header
      await tx.roadmap.update({
        where: { id: existingRoadmap.id },
        data: {
          targetCountryCode: newCountryCode,
          targetIntakeSeason: newIntakeSeason.toUpperCase() as any,
          targetIntakeYear: newIntakeYear,
          targetUniversityId: newUniversityId || null,
          targetProgramId: newProgramId || null,
          fundingChoice: newFundingChoice as any,
          scholarshipId: newScholarshipId || null,
          versionNumber: nextVersion,
        },
      });

      // 4. Create newly merged phases and tasks
      for (const phase of mergedPhases) {
        const createdPhase = await tx.roadmapPhase.create({
          data: {
            roadmapId: existingRoadmap.id,
            phaseNumber: phase.phaseNumber,
            phaseKey: phase.phaseKey,
            timeframeNoticeBn: phase.timeframeNoticeBn,
            titleBn: phase.titleBn,
            titleEn: phase.titleEn,
            isCompleted: phase.isCompleted,
          },
        });

        for (const task of phase.tasks) {
          await tx.roadmapTask.create({
            data: {
              phaseId: createdPhase.id,
              taskCode: task.taskCode,
              titleBn: task.titleBn,
              titleEn: task.titleEn,
              bengaliExplanation: task.bengaliExplanation,
              whyItMattersBn: task.whyItMattersBn,
              requiredDocumentsJson: JSON.stringify(task.requiredDocuments),
              estimatedCostBdt: task.estimatedCostBdt,
              costCurrency: task.costCurrency,
              estimatedDurationDays: task.estimatedDurationDays,
              startDate: task.startDate ? new Date(task.startDate) : null,
              dueDate: task.dueDate ? new Date(task.dueDate) : null,
              priority: task.priority as any,
              status: task.status as any,
              dependenciesJson: JSON.stringify(task.dependencies),
              officialSourceUrl: task.officialSourceUrl,
              officialSourceOrg: task.officialSourceOrg,
              completionCriteriaBn: task.completionCriteriaBn,
              needsReview: task.needsReview,
              isCompleted: task.isCompleted,
              completedAt: task.completedAt ? new Date(task.completedAt) : null,
            },
          });
        }
      }

      return tx.roadmap.findUnique({
        where: { id: existingRoadmap.id },
        include: {
          phases: {
            include: {
              tasks: { orderBy: { createdAt: "asc" } },
            },
            orderBy: { phaseNumber: "asc" },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: updatedRoadmap,
      meta: {
        preservedMilestonesCount: preservedCount,
        newVersionNumber: nextVersion,
        changeReasonBn,
      },
      message: `রোডম্যাপ সফলভাবে রিক্যালকুলেট হয়েছে। পূর্ববর্তী ${preservedCount}টি সম্পন্ন মাইলস্টোন অক্ষুণ্ণ রাখা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Recalculate roadmap error:", error);
    return NextResponse.json(
      { error: "রোডম্যাপ রিক্যালকুলেট করতে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
