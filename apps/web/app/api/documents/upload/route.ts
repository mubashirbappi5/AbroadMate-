import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { uploadStudentDocument } from "@/lib/storage";
import { DocumentCategory } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as DocumentCategory | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "অনুগ্রহ করে একটি ফাইল সিলেক্ট করুন।" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: "ডকুমেন্টের ক্যাটাগরি নির্ধারণ করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const doc = await uploadStudentDocument({
      userId: session.user.id,
      fileBuffer,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      category,
    });

    return NextResponse.json(
      {
        success: true,
        message: "ডকুমেন্ট সফলভাবে আপলোড হয়েছে!",
        data: {
          id: doc.id,
          fileName: doc.fileName,
          category: doc.category,
          fileSize: doc.fileSize,
          createdAt: doc.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Document upload route error:", error);
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 400;
    return NextResponse.json(
      {
        success: false,
        error: error.message || "ডকুমেন্ট আপলোড করার সময় সমস্যা হয়েছে।",
      },
      { status }
    );
  }
}
