import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.fullName,
        primaryRole: session.user.primaryRole,
        roles: session.user.roles.map((r) => r.role),
      },
    });
  } catch (error: any) {
    console.error("Session verification error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error: "সেশন যাচাই করতে ব্যর্থ হয়েছে।",
      },
      { status: 500 }
    );
  }
}
