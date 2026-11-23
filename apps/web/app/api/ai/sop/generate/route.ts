import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { sopGenerateSchema } from "@abroadmate/validation";
import { aiProvider, checkRateLimit } from "@abroadmate/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = session ? `user:${session.user.id}` : `ip:${clientIp}`;

    const limit = checkRateLimit(`sop:${rateLimitKey}`, 15, 86400000); // 15 per day
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "আজকের জন্য এসওপি ড্রাফট জেনারেট করার দৈনিক সীমা পূর্ণ হয়েছে।" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = sopGenerateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ভুল ইনপুট ফরম্যাট।", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const input = parseResult.data;
    const startTime = Date.now();

    // Call AI provider to generate authentic draft
    const draftResult = await aiProvider.generateSopDraft(input as any);
    const latencyMs = Date.now() - startTime;

    let savedDocument = null;

    if (session) {
      const userId = session.user.id;

      // Persist in database
      savedDocument = await prisma.$transaction(async (tx) => {
        let doc = await tx.sOPDocument.findFirst({
          where: { userId },
          orderBy: { updatedAt: "desc" },
        });

        const nextVersion = doc ? doc.versionNumber + 1 : 1;

        if (doc) {
          doc = await tx.sOPDocument.update({
            where: { id: doc.id },
            data: {
              title: draftResult.title,
              targetCountryCode: input.targetCountry,
              targetUniversity: input.targetUniversity,
              targetProgram: input.targetProgram,
              degreeLevel: input.degreeLevel as any,
              content: draftResult.fullDraft,
              sectionsJson: JSON.stringify(draftResult.sections),
              versionNumber: nextVersion,
              toneStyle: input.tone,
            },
          });
        } else {
          doc = await tx.sOPDocument.create({
            data: {
              userId,
              title: draftResult.title,
              targetCountryCode: input.targetCountry,
              targetUniversity: input.targetUniversity,
              targetProgram: input.targetProgram,
              degreeLevel: input.degreeLevel as any,
              content: draftResult.fullDraft,
              sectionsJson: JSON.stringify(draftResult.sections),
              versionNumber: 1,
              toneStyle: input.tone,
            },
          });
        }

        // Record revision snapshot
        await tx.sOPDocumentRevision.create({
          data: {
            sopDocumentId: doc.id,
            versionNumber: nextVersion,
            changeSummary: `প্রাথমিক ড্রাফট জেনারেশন (${input.tone} টোন)`,
            contentSnapshot: draftResult.fullDraft,
            sectionsSnapshot: JSON.stringify(draftResult.sections),
            wordCount: draftResult.wordCount,
          },
        });

        // Log token usage telemetry
        if (draftResult.tokensUsed) {
          await tx.aITokenUsageLog.create({
            data: {
              userId,
              featureName: "SOP_BUILDER",
              modelName: "gpt-4o-mini",
              promptTokens: draftResult.tokensUsed.promptTokens,
              completionTokens: draftResult.tokensUsed.completionTokens,
              totalTokens: draftResult.tokensUsed.totalTokens,
              estimatedCostUsd: draftResult.estimatedCostUsd || 0,
              latencyMs,
            },
          });
        }

        return doc;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...draftResult,
        documentId: savedDocument?.id,
        versionNumber: savedDocument?.versionNumber || 1,
      },
      message: "সততা ও নীতিমালার আলোকে এসওপি ড্রাফট সফলভাবে তৈরি হয়েছে।",
    });
  } catch (error: any) {
    console.error("SOP Generation error:", error);
    return NextResponse.json(
      { error: "এসওপি ড্রাফট তৈরিতে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
