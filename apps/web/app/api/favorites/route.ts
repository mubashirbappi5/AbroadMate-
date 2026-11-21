import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma, FavoriteCategory, FavoriteItemType } from "@abroadmate/database";
import { savedFavoriteSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "সংরক্ষিত শর্টলিস্ট দেখতে প্রথমে লগইন করুন।" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get("category");

    const whereClause: any = {
      userId: session.user.id,
    };

    if (categoryParam && ["AMBITIOUS", "TARGET", "SAFE"].includes(categoryParam)) {
      whereClause.category = categoryParam as FavoriteCategory;
    }

    const favorites = await prisma.savedFavorite.findMany({
      where: whereClause,
      include: {
        university: {
          include: {
            country: true,
          },
        },
        program: {
          include: {
            university: {
              include: {
                country: true,
              },
            },
            admissionRequirements: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: favorites,
      total: favorites.length,
    });
  } catch (error: any) {
    console.error("Fetch favorites error:", error);
    return NextResponse.json(
      { success: false, error: "শর্টলিস্ট লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "শর্টলিস্টে যুক্ত করতে লগইন করুন।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = savedFavoriteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভ্যালিডেশন ব্যর্থ হয়েছে।",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { itemType, targetId, category, notes } = validation.data;
    const userId = session.user.id;

    // Check if already favorited
    let existing;
    if (itemType === "UNIVERSITY") {
      existing = await prisma.savedFavorite.findFirst({
        where: { userId, universityId: targetId },
      });
    } else {
      existing = await prisma.savedFavorite.findFirst({
        where: { userId, programId: targetId },
      });
    }

    if (existing) {
      // Update existing category or notes
      const updated = await prisma.savedFavorite.update({
        where: { id: existing.id },
        data: {
          category: category as FavoriteCategory,
          notes: notes || existing.notes,
        },
      });

      return NextResponse.json({
        success: true,
        message: "শর্টলিস্ট আপডেট করা হয়েছে!",
        data: updated,
      });
    }

    // Create new favorite
    const created = await prisma.savedFavorite.create({
      data: {
        userId,
        itemType: itemType as FavoriteItemType,
        universityId: itemType === "UNIVERSITY" ? targetId : null,
        programId: itemType === "PROGRAM" ? targetId : null,
        category: category as FavoriteCategory,
        notes: notes || null,
      },
      include: {
        university: true,
        program: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "শর্টলিস্টে সফলভাবে যুক্ত হয়েছে!",
      data: created,
    });
  } catch (error: any) {
    console.error("Save favorite error:", error);
    return NextResponse.json(
      { success: false, error: "শর্টলিস্টে যুক্ত করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
