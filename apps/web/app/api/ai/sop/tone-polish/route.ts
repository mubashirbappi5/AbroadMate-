import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { sopTonePolishSchema } from "@abroadmate/validation";
import { aiProvider } from "@abroadmate/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const body = await request.json();
    const parseResult = sopTonePolishSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ভুল ইনপুট ফরম্যাট।", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { fullContent, targetTone } = parseResult.data;
    const documentId = body.documentId as string | undefined;

    const polishResult = await aiProvider.improveSopTone({
      fullContent,
      targetTone,
    });

    if (session && documentId) {
      const existing = await prisma.sOPDocument.findUnique({
        where: { id: documentId },
      });

      if (existing && existing.userId === session.user.id) {
        const nextVersion = existing.versionNumber + 1;

        await prisma.$transaction(async (tx) => {
          await tx.sOPDocument.update({
            where: { id: documentId },
            data: {
              content: polishResult.polishedContent,
              toneStyle: targetTone,
              versionNumber: nextVersion,
            },
          });

          await tx.sOPDocumentRevision.create({
            data: {
              sopDocumentId: documentId,
              versionNumber: nextVersion,
              changeSummary: `${targetTone} টোন প্রয়োগ ও ব্যাকরণ পরিমার্জন`,
              contentSnapshot: polishResult.polishedContent,
              wordCount: polishResult.polishedContent.split(/\s+/).filter(Boolean).length,
            },
          });
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: polishResult,
      message: "টোন ও ব্যাকরণ সফলভাবে পরিমার্জন করা হয়েছে।",
    });
  } catch (error: any) {
    console.error("SOP Tone Polish error:", error);
    return NextResponse.json(
      { error: "টোন পরিমার্জনে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
