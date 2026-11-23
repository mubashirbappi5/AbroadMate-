import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ success: true, data: [] });
    }

    const docId = request.nextUrl.searchParams.get("documentId");

    let document;
    if (docId) {
      document = await prisma.sOPDocument.findUnique({
        where: { id: docId, userId: session.user.id },
      });
    } else {
      document = await prisma.sOPDocument.findFirst({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
      });
    }

    if (!document) {
      return NextResponse.json({ success: true, data: [] });
    }

    const revisions = await prisma.sOPDocumentRevision.findMany({
      where: { sopDocumentId: document.id },
      orderBy: { versionNumber: "desc" },
      select: {
        id: true,
        versionNumber: true,
        changeSummary: true,
        wordCount: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: revisions,
      currentDocument: {
        id: document.id,
        title: document.title,
        versionNumber: document.versionNumber,
        content: document.content,
        sectionsJson: document.sectionsJson,
        toneStyle: document.toneStyle,
        critiqueScore: document.critiqueScore,
      },
    });
  } catch (error: any) {
    console.error("Fetch revisions error:", error);
    return NextResponse.json(
      { error: "রিভিশন তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }

    const body = await request.json();
    const { revisionId } = body;

    const revision = await prisma.sOPDocumentRevision.findUnique({
      where: { id: revisionId },
      include: { sopDocument: true },
    });

    if (!revision || revision.sopDocument.userId !== session.user.id) {
      return NextResponse.json({ error: "রিভিশন পাওয়া যায়নি।" }, { status: 404 });
    }

    const nextVersion = revision.sopDocument.versionNumber + 1;

    const updated = await prisma.$transaction(async (tx) => {
      const doc = await tx.sOPDocument.update({
        where: { id: revision.sopDocumentId },
        data: {
          content: revision.contentSnapshot,
          sectionsJson: revision.sectionsSnapshot || null,
          versionNumber: nextVersion,
        },
      });

      await tx.sOPDocumentRevision.create({
        data: {
          sopDocumentId: revision.sopDocumentId,
          versionNumber: nextVersion,
          changeSummary: `সংস্করণ ${revision.versionNumber} থেকে রিস্টোর করা হয়েছে`,
          contentSnapshot: revision.contentSnapshot,
          sectionsSnapshot: revision.sectionsSnapshot || null,
          wordCount: revision.wordCount,
        },
      });

      return doc;
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `সংস্করণ ${revision.versionNumber} সফলভাবে রিস্টোর হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Restore revision error:", error);
    return NextResponse.json(
      { error: "রিভিশন রিস্টোর করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
