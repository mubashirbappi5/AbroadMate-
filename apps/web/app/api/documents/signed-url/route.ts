import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { generateDocumentSignedUrl } from "@/lib/storage";
import { AppRole } from "@abroadmate/database";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { documentId, expiresInSeconds } = body;

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: "ডকুমেন্ট আইডি আবশ্যক।" },
        { status: 400 }
      );
    }

    const adminRoles: AppRole[] = [
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
    ];
    const isAdmin = adminRoles.includes(session.user.primaryRole);

    const result = await generateDocumentSignedUrl({
      requestingUserId: session.user.id,
      documentId,
      isAdmin,
      expiresInSeconds: expiresInSeconds || 900,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Signed URL route error:", error);
    const status = error.message?.includes("UNAUTHORIZED")
      ? 401
      : error.message?.includes("FORBIDDEN")
      ? 403
      : 400;

    return NextResponse.json(
      {
        success: false,
        error: error.message || "ডকুমেন্টের সিকিউর লিঙ্ক তৈরিতে ব্যর্থ হয়েছে।",
      },
      { status }
    );
  }
}
