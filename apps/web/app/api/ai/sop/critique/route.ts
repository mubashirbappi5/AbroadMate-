import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { sopCritiqueSchema } from "@abroadmate/validation";
import { aiProvider } from "@abroadmate/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const body = await request.json();
    const parseResult = sopCritiqueSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ভুল ইনপুট ফরম্যাট।", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { fullContent, targetUniversity, targetProgram } = parseResult.data;
    const documentId = body.documentId as string | undefined;

    const critiqueResult = await aiProvider.critiqueSop({
      fullContent,
      targetUniversity,
      targetProgram,
    });

    if (session && documentId) {
      await prisma.sOPDocument.updateMany({
        where: { id: documentId, userId: session.user.id },
        data: {
          critiqueScore: critiqueResult.overallScore,
          aiFeedbackJson: JSON.stringify({
            clarityScore: critiqueResult.clarityScore,
            motivationScore: critiqueResult.motivationScore,
            academicFitScore: critiqueResult.academicFitScore,
            strengthsBn: critiqueResult.strengthsBn,
            improvementPointsBn: critiqueResult.improvementPointsBn,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: critiqueResult,
    });
  } catch (error: any) {
    console.error("SOP Critique error:", error);
    return NextResponse.json(
      { error: "এসওপি রিভিউতে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
