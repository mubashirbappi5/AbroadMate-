import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const body = await request.json().catch(() => ({}));

    let title = body.title || "Statement of Purpose";
    let content = body.content || "";
    let studentName = body.studentName || session?.user?.fullName || "Applicant";

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

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 25.4mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }
    h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta {
      font-size: 11pt;
      color: #4b5563;
      margin: 0;
    }
    .content p {
      margin: 0 0 1.25rem 0;
      text-align: justify;
      text-indent: 2rem;
    }
    .footer {
      margin-top: 3rem;
      border-top: 1px solid #e5e7eb;
      padding-top: 0.75rem;
      font-size: 10pt;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <p class="meta">Applicant: <strong>${studentName}</strong> | Prepared via AbroadMate AI</p>
  </div>
  <div class="content">
    ${paragraphs.map((p: string) => `<p>${p}</p>`).join("\n    ")}
  </div>
  <div class="footer">
    <span>Verified & Honest Submission Document</span>
    <span>Page 1 of 1</span>
  </div>
  <script>
    window.onload = function() {
      // Auto trigger print if query parameter indicates print
      if (window.location.search.includes('print=true')) {
        window.print();
      }
    };
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.html"`,
      },
    });
  } catch (error: any) {
    console.error("PDF Export error:", error);
    return NextResponse.json(
      { error: "PDF এক্সপোর্ট প্রক্রিয়াকরণে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
