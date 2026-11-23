import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { updateRoadmapTaskSchema } from "@abroadmate/validation";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "টাস্ক আপডেট করতে লগইন করা আবশ্যক।" },
        { status: 401 }
      );
    }

    const { id: taskId } = await params;
    const body = await request.json();
    const parseResult = updateRoadmapTaskSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { status, isCompleted } = parseResult.data;

    // Find the task and its roadmap
    const task = await prisma.roadmapTask.findUnique({
      where: { id: taskId },
      include: {
        phase: {
          include: {
            roadmap: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "টাস্ক পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    if (task.phase.roadmap.userId !== session.user.id) {
      return NextResponse.json(
        { error: "এই টাস্কটি পরিবর্তন করার অনুমতি আপনার নেই।" },
        { status: 403 }
      );
    }

    const roadmapId = task.phase.roadmapId;
    const finalIsCompleted = status === "COMPLETED" || (isCompleted ?? false);
    const finalStatus = finalIsCompleted ? "COMPLETED" : status;

    // Execute atomic update and DAG cascade
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update target task
      const updatedTarget = await tx.roadmapTask.update({
        where: { id: taskId },
        data: {
          status: finalStatus as any,
          isCompleted: finalIsCompleted,
          completedAt: finalIsCompleted ? (task.completedAt || new Date()) : null,
        },
      });

      // 2. Fetch all tasks in this roadmap to run DAG evaluation
      const allPhases = await tx.roadmapPhase.findMany({
        where: { roadmapId },
        include: { tasks: true },
      });

      const completedTaskCodes = new Set<string>();
      for (const p of allPhases) {
        for (const t of p.tasks) {
          const isTaskDone = t.id === taskId ? finalIsCompleted : t.status === "COMPLETED" || t.isCompleted;
          if (isTaskDone) {
            completedTaskCodes.add(t.taskCode);
          }
        }
      }

      // 3. Cascade dependency status to other tasks
      for (const p of allPhases) {
        let phaseCompleted = true;

        for (const t of p.tasks) {
          if (t.id === taskId) {
            if (!finalIsCompleted && finalStatus !== "SKIPPED") {
              phaseCompleted = false;
            }
            continue;
          }

          if (t.status === "COMPLETED" || t.status === "SKIPPED") {
            continue;
          }

          let dependencies: string[] = [];
          if (t.dependenciesJson) {
            try {
              dependencies = JSON.parse(t.dependenciesJson);
            } catch (e) {
              dependencies = [];
            }
          }

          if (dependencies.length > 0) {
            const allMet = dependencies.every((dep) => completedTaskCodes.has(dep));
            const newStatus = allMet ? "NOT_STARTED" : "BLOCKED";

            if (t.status !== newStatus) {
              await tx.roadmapTask.update({
                where: { id: t.id },
                data: { status: newStatus as any },
              });
            }
          }

          phaseCompleted = false;
        }

        // Update phase status
        await tx.roadmapPhase.update({
          where: { id: p.id },
          data: { isCompleted: phaseCompleted },
        });
      }

      return updatedTarget;
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "টাস্ক স্ট্যাটাস ও ডিপেন্ডেন্সি আপডেট সফল হয়েছে।",
    });
  } catch (error: any) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "টাস্ক আপডেট করতে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
