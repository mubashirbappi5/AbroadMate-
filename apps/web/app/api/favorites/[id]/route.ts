import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma, FavoriteCategory } from "@abroadmate/database";
import { updateFavoriteCategorySchema } from "@abroadmate/validation";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "শর্টলিস্ট মুছতে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = session.user.id;

    const favorite = await prisma.savedFavorite.findUnique({
      where: { id },
    });

    if (!favorite || favorite.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "শর্টলিস্ট রেকর্ডটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.savedFavorite.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "শর্টলিস্ট থেকে সফলভাবে সরানো হয়েছে।",
    });
  } catch (error: any) {
    console.error("Delete favorite error:", error);
    return NextResponse.json(
      { success: false, error: "শর্টলিস্ট মুছতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "শর্টলিস্ট আপডেট করতে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = session.user.id;
    const body = await request.json();

    const validation = updateFavoriteCategorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভ্যালিডেশন ত্রুটি।",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const favorite = await prisma.savedFavorite.findUnique({
      where: { id },
    });

    if (!favorite || favorite.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "শর্টলিস্ট রেকর্ডটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const updated = await prisma.savedFavorite.update({
      where: { id },
      data: {
        category: validation.data.category as FavoriteCategory,
        notes: validation.data.notes !== undefined ? validation.data.notes : favorite.notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "শর্টলিস্ট ক্যাটাগরি আপডেট করা হয়েছে!",
      data: updated,
    });
  } catch (error: any) {
    console.error("Update favorite error:", error);
    return NextResponse.json(
      { success: false, error: "শর্টলিস্ট আপডেট করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
