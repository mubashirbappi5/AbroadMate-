import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { generateRoadmapSchema } from "@abroadmate/validation";
import { generateIntelligentRoadmap, RoadmapPhaseDefinition } from "@abroadmate/roadmap-engine";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const body = await request.json();
    const parseResult = generateRoadmapSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    // Generate intelligent roadmap blueprint
    const generatedPhases = generateIntelligentRoadmap({
      targetCountryCode: input.targetCountryCode,
      targetIntakeSeason: input.targetIntakeSeason,
      targetIntakeYear: input.targetIntakeYear,
      targetUniversityId: input.targetUniversityId,
      targetUniversityName: input.targetUniversityName,
      targetProgramId: input.targetProgramId,
      targetProgramName: input.targetProgramName,
      degreeLevel: input.degreeLevel,
      fundingChoice: input.fundingChoice,
      scholarshipId: input.scholarshipId,
      scholarshipName: input.scholarshipName,
      englishProficiencyScore: input.englishProficiencyScore,
      hasValidPassport: input.hasValidPassport,
    });

    // If not authenticated, return generated roadmap for guest preview
    if (!session) {
      return NextResponse.json({
        success: true,
        data: {
          roadmap: {
            targetCountryCode: input.targetCountryCode,
            targetIntakeSeason: input.targetIntakeSeason,
            targetIntakeYear: input.targetIntakeYear,
            fundingChoice: input.fundingChoice,
            phases: generatedPhases,
          },
          isGuestPreview: true,
        },
      });
    }

    const userId = session.user.id;

    // Persist in database inside transaction
    const savedRoadmap = await prisma.$transaction(async (tx) => {
      // Find existing roadmap for this user
      const existingRoadmap = await tx.roadmap.findFirst({
        where: { userId },
        include: {
          phases: {
            include: { tasks: true },
            orderBy: { phaseNumber: "asc" },
          },
        },
      });

      let roadmapRecord;
      let nextVersion = 1;

      if (existingRoadmap) {
        nextVersion = existingRoadmap.versionNumber + 1;

        // Archive previous version state
        await tx.roadmapVersionHistory.create({
          data: {
            roadmapId: existingRoadmap.id,
            versionNumber: existingRoadmap.versionNumber,
            changeReasonBn: "নতুন রোডম্যাপ জেনারেশন ও প্যারামিটার আপডেট",
            snapshotJson: JSON.stringify(existingRoadmap),
          },
        });

        // Delete previous phases and tasks to replace with newly generated blueprint
        await tx.roadmapPhase.deleteMany({
          where: { roadmapId: existingRoadmap.id },
        });

        roadmapRecord = await tx.roadmap.update({
          where: { id: existingRoadmap.id },
          data: {
            targetCountryCode: input.targetCountryCode,
            targetIntakeSeason: input.targetIntakeSeason.toUpperCase() as any,
            targetIntakeYear: input.targetIntakeYear,
            targetUniversityId: input.targetUniversityId || null,
            targetProgramId: input.targetProgramId || null,
            fundingChoice: input.fundingChoice as any,
            scholarshipId: input.scholarshipId || null,
            versionNumber: nextVersion,
          },
        });
      } else {
        roadmapRecord = await tx.roadmap.create({
          data: {
            userId,
            targetCountryCode: input.targetCountryCode,
            targetIntakeSeason: input.targetIntakeSeason.toUpperCase() as any,
            targetIntakeYear: input.targetIntakeYear,
            targetUniversityId: input.targetUniversityId || null,
            targetProgramId: input.targetProgramId || null,
            fundingChoice: input.fundingChoice as any,
            scholarshipId: input.scholarshipId || null,
            versionNumber: 1,
          },
        });
      }

      // Create phases and tasks
      for (const phase of generatedPhases) {
        const createdPhase = await tx.roadmapPhase.create({
          data: {
            roadmapId: roadmapRecord.id,
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

      return roadmapRecord;
    });

    // Fetch the complete saved roadmap with nested phases and tasks
    const fullRoadmap = await prisma.roadmap.findUnique({
      where: { id: savedRoadmap.id },
      include: {
        phases: {
          include: {
            tasks: {
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { phaseNumber: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: fullRoadmap,
      message: "ব্যক্তিগত স্টাডি অ্যাব্রড রোডম্যাপ সফলভাবে প্রস্তুত হয়েছে।",
    });
  } catch (error: any) {
    console.error("Generate roadmap error:", error);
    return NextResponse.json(
      { error: "রোডম্যাপ তৈরিতে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
