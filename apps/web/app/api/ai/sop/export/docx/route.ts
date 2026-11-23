import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { generateDocxBuffer } from "@abroadmate/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const body = await request.json().catch(() => ({}));

    let title = body.title || "Statement of Purpose";
    let content = body.content || "";

    if (body.documentId && session) {
      const doc = await prisma.sOPDocument.findUnique({
        where: { id: body.documentId, userId: session.user.id },
      });
      if (doc) {
        title = doc.title;
        content = doc.content;
      }
    }

    if (!content) {
      return NextResponse.json(
        { error: "এসওপি কনটেন্ট খালি হতে পারে না।" },
        { status: 400 }
      );
    }

    const paragraphs = content
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter(Boolean);

    const docxBuffer = generateDocxBuffer(title, paragraphs);

    const filename = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`;

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("DOCX Export error:", error);
    return NextResponse.json(
      { error: "DOCX এক্সপোর্ট প্রক্রিয়াকরণে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
