import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "ডেডলাইন আপডেট করতে লগইন করা আবশ্যক।" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const deadline = await prisma.deadline.findUnique({
      where: { id },
    });

    if (!deadline) {
      return NextResponse.json(
        { error: "ডেডলাইন পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Toggle completion
    const updated = await prisma.deadline.update({
      where: { id },
      data: {
        isCompleted: typeof body.isCompleted === "boolean" ? body.isCompleted : !deadline.isCompleted,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error("Update deadline error:", error);
    return NextResponse.json(
      { error: "ডেডলাইন আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "ডেডলাইন মুছতে লগইন করা আবশ্যক।" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const deadline = await prisma.deadline.findUnique({
      where: { id },
    });

    if (!deadline) {
      return NextResponse.json(
        { error: "ডেডলাইন পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Only allow deleting user's custom deadline or if user is admin
    if (deadline.userId !== session.user.id && deadline.isGlobal) {
      return NextResponse.json(
        { error: "গ্লোবাল সিস্টেম ডেডলাইন ডিলিট করার অনুমতি নেই।" },
        { status: 403 }
      );
    }

    await prisma.deadline.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "রিমাইন্ডার সফলভাবে মুছে ফেলা হয়েছে।",
    });
  } catch (error: any) {
    console.error("Delete deadline error:", error);
    return NextResponse.json(
      { error: "ডেডলাইন মুছতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
