import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { sopSectionEditSchema } from "@abroadmate/validation";
import { aiProvider } from "@abroadmate/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const body = await request.json();
    const parseResult = sopSectionEditSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ভুল ইনপুট ফরম্যাট।", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const input = parseResult.data;
    const documentId = body.documentId as string | undefined;

    const editResult = await aiProvider.editSopSection({
      sectionKey: input.sectionKey,
      currentContent: input.currentContent,
      userInstruction: input.userInstruction,
      context: input.context,
    });

    if (session && documentId) {
      const existing = await prisma.sOPDocument.findUnique({
        where: { id: documentId },
      });

      if (existing && existing.userId === session.user.id) {
        let sections = {} as Record<string, string>;
        if (existing.sectionsJson) {
          try {
            sections = JSON.parse(existing.sectionsJson);
          } catch (e) {}
        }

        sections[input.sectionKey] = editResult.updatedContent;
        const newFullContent = Object.values(sections).join("\n\n");
        const nextVersion = existing.versionNumber + 1;

        await prisma.$transaction(async (tx) => {
          await tx.sOPDocument.update({
            where: { id: documentId },
            data: {
              content: newFullContent,
              sectionsJson: JSON.stringify(sections),
              versionNumber: nextVersion,
            },
          });

          await tx.sOPDocumentRevision.create({
            data: {
              sopDocumentId: documentId,
              versionNumber: nextVersion,
              changeSummary: `${input.sectionKey} অনুচ্ছেদ সম্পাদনা: ${input.userInstruction}`,
              contentSnapshot: newFullContent,
              sectionsSnapshot: JSON.stringify(sections),
              wordCount: newFullContent.split(/\s+/).filter(Boolean).length,
            },
          });
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: editResult,
      message: "অনুরোধ অনুযায়ী অনুচ্ছেদ সফলভাবে হালনাগাদ করা হয়েছে।",
    });
  } catch (error: any) {
    console.error("SOP Section Edit error:", error);
    return NextResponse.json(
      { error: "অনুচ্ছেদ সম্পাদনায় সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
