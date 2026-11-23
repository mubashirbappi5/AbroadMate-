import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { generateIntelligentRoadmap } from "@abroadmate/roadmap-engine";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      // Return default guest roadmap preview
      const guestRoadmap = generateIntelligentRoadmap({
        targetCountryCode: "GB",
        targetIntakeSeason: "fall",
        targetIntakeYear: 2026,
        fundingChoice: "SELF_FUNDED",
      });

      return NextResponse.json({
        success: true,
        data: {
          isGuest: true,
          targetCountryCode: "GB",
          targetIntakeSeason: "FALL",
          targetIntakeYear: 2026,
          fundingChoice: "SELF_FUNDED",
          phases: guestRoadmap,
          progress: {
            totalTasks: guestRoadmap.flatMap((p) => p.tasks).length,
            completedTasks: 0,
            progressPercentage: 0,
            totalEstimatedCostBdt: guestRoadmap
              .flatMap((p) => p.tasks)
              .reduce((acc, t) => acc + t.estimatedCostBdt, 0),
          },
        },
      });
    }

    const userId = session.user.id;

    let roadmap = await prisma.roadmap.findFirst({
      where: { userId },
      include: {
        university: {
          select: { nameEn: true, nameBn: true, city: true },
        },
        program: {
          select: { titleEn: true, titleBn: true, degreeLevel: true },
        },
        scholarship: {
          select: { titleEn: true, titleBn: true, providerName: true },
        },
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

    // If user has no roadmap yet, create one from their profile/goal if available
    if (!roadmap) {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
      });
      const goal = await prisma.userGoal.findFirst({
        where: { userId },
      });

      const countryCode = goal?.targetCountryCodes?.[0] || "GB";
      const season = (goal?.targetIntakeSeason?.toLowerCase() || "fall") as "fall" | "spring" | "summer";
      const year = goal?.targetIntakeYear || 2026;

      const generated = generateIntelligentRoadmap({
        targetCountryCode: countryCode,
        targetIntakeSeason: season,
        targetIntakeYear: year,
        fundingChoice: "SELF_FUNDED",
        hasValidPassport: studentProfile?.hasPassport || false,
      });

      // Auto-save the initial roadmap for the user
      roadmap = await prisma.$transaction(async (tx) => {
        const created = await tx.roadmap.create({
          data: {
            userId,
            targetCountryCode: countryCode,
            targetIntakeSeason: season.toUpperCase() as any,
            targetIntakeYear: year,
            fundingChoice: "SELF_FUNDED",
            versionNumber: 1,
          },
        });

        for (const phase of generated) {
          const createdPhase = await tx.roadmapPhase.create({
            data: {
              roadmapId: created.id,
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
          where: { id: created.id },
          include: {
            university: { select: { nameEn: true, nameBn: true, city: true } },
            program: { select: { titleEn: true, titleBn: true, degreeLevel: true } },
            scholarship: { select: { titleEn: true, titleBn: true, providerName: true } },
            phases: {
              include: {
                tasks: { orderBy: { createdAt: "asc" } },
              },
              orderBy: { phaseNumber: "asc" },
            },
          },
        });
      });
    }

    if (!roadmap) {
      return NextResponse.json(
        { error: "রোডম্যাপ পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Compute progress metrics
    const allTasks = roadmap.phases.flatMap((p) => p.tasks);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => t.status === "COMPLETED" || t.isCompleted).length;
    const blockedTasks = allTasks.filter((t) => t.status === "BLOCKED").length;
    const needsReviewTasks = allTasks.filter((t) => t.needsReview).length;
    const totalEstimatedCostBdt = allTasks.reduce((sum, t) => sum + (t.estimatedCostBdt || 0), 0);
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...roadmap,
        progress: {
          totalTasks,
          completedTasks,
          blockedTasks,
          needsReviewTasks,
          progressPercentage,
          totalEstimatedCostBdt,
        },
      },
    });
  } catch (error: any) {
    console.error("Fetch roadmap error:", error);
    return NextResponse.json(
      { error: "রোডম্যাপ লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
