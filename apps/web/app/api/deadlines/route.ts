import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { createDeadlineSchema } from "@abroadmate/validation";

const INITIAL_SEED_DEADLINES = [
  {
    titleBn: "শেভেনিং স্কলারশিপ অনলাইন আবেদন সমাপ্তি (UK)",
    titleEn: "Chevening Scholarships Online Application Deadline",
    category: "SCHOLARSHIP",
    deadlineType: "SCHOLARSHIP_DEADLINE" as const,
    countryCode: "GB",
    deadlineDate: new Date("2026-11-05T23:59:59.000Z"),
    officialUrl: "https://www.chevening.org/apply/",
    notesBn: "যুক্তরাজ্যের পররাষ্ট্র মন্ত্রণালয়ের সম্পূর্ণ অর্থায়নে মাস্টার্স। ৪টি লিডারশিপ এসে জমা দিতে হবে।",
    isGlobal: true,
  },
  {
    titleBn: "আইইএলটিএস একাডেমিক টেস্ট রেজিস্ট্রেশন",
    titleEn: "IELTS Academic Test Registration & Exam Date",
    category: "TEST",
    deadlineType: "IELTS_TEST_DATE" as const,
    countryCode: "GLOBAL",
    deadlineDate: new Date("2026-10-15T23:59:59.000Z"),
    officialUrl: "https://www.britishcouncil.org.bd/en/exam/ielts",
    notesBn: "ব্রিটিশ কাউন্সিল বা আইডিপিতে পরীক্ষার স্লট বুক করুন। লক্ষ্য স্কোর: ন্যূনতম ৬.৫+।",
    isGlobal: true,
  },
  {
    titleBn: "ডিএএডি (DAAD) ইপিওএস স্কলারশিপ জার্মানি",
    titleEn: "DAAD EPOS / Study Scholarships Germany",
    category: "SCHOLARSHIP",
    deadlineType: "SCHOLARSHIP_DEADLINE" as const,
    countryCode: "DE",
    deadlineDate: new Date("2026-10-31T23:59:59.000Z"),
    officialUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    notesBn: "জার্মানিতে সম্পূর্ণ বিনামূল্যে মাস্টার্স পড়ার সুযোগ এবং মাসিক ৯৩৪ ইউরো লিভিং স্টাইপেন্ড।",
    isGlobal: true,
  },
  {
    titleBn: "ইউকে ভিসা ২৮-দিনের ব্যাংক ফান্ড শুরু (Bank Solvency)",
    titleEn: "UK Student Visa 28-Day Bank Funds Maintenance",
    category: "VISA",
    deadlineType: "VISA_SUBMISSION_DEADLINE" as const,
    countryCode: "GB",
    deadlineDate: new Date("2026-06-15T23:59:59.000Z"),
    officialUrl: "https://www.gov.uk/student-visa/money",
    notesBn: "ভিসা আবেদনের পূর্বে অনুমোদিত বাংলাদেশি ব্যাংক অ্যাকাউন্টে টানা ২৮ দিন ২৮-৩৫ লাখ টাকা নিরবচ্ছিন্ন রাখতে হবে।",
    isGlobal: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const userId = session?.user?.id;

    // Check if we need to seed initial global deadlines
    const existingCount = await prisma.deadline.count({
      where: { isGlobal: true },
    });

    if (existingCount === 0) {
      for (const dl of INITIAL_SEED_DEADLINES) {
        await prisma.deadline.create({ data: dl });
      }
    }

    // Query global deadlines plus user-specific custom deadlines
    const deadlines = await prisma.deadline.findMany({
      where: {
        OR: [
          { isGlobal: true },
          ...(userId ? [{ userId }] : []),
        ],
      },
      include: {
        reminders: true,
      },
      orderBy: { deadlineDate: "asc" },
    });

    const now = new Date();
    const formatted = deadlines.map((d) => {
      const diffMs = new Date(d.deadlineDate).getTime() - now.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        id: d.id,
        titleBn: d.titleBn,
        titleEn: d.titleEn,
        deadlineType: d.deadlineType,
        category: d.category.toLowerCase(),
        countryCode: d.countryCode || "GLOBAL",
        date: d.deadlineDate.toISOString().split("T")[0],
        deadlineDate: d.deadlineDate,
        daysLeft,
        isUrgent: daysLeft >= 0 && daysLeft <= 30 && !d.isCompleted,
        notesBn: d.notesBn || "",
        officialUrl: d.officialUrl,
        isCompleted: d.isCompleted,
        isCustom: !d.isGlobal,
        reminders: d.reminders,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("Fetch deadlines error:", error);
    return NextResponse.json(
      { error: "ডেডলাইন তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { error: "ব্যক্তিগত ডেডলাইন যুক্ত করতে লগইন করুন।" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = createDeadlineSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const created = await prisma.deadline.create({
      data: {
        userId: session.user.id,
        titleBn: data.titleBn,
        titleEn: data.titleEn,
        deadlineType: data.deadlineType as any,
        category: data.category.toUpperCase(),
        countryCode: data.countryCode || "BD",
        deadlineDate: new Date(data.deadlineDate),
        officialUrl: data.officialUrl || null,
        notesBn: data.notesBn || null,
        isGlobal: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: "ব্যক্তিগত রিমাইন্ডার সফলভাবে সংরক্ষিত হয়েছে।",
    });
  } catch (error: any) {
    console.error("Create deadline error:", error);
    return NextResponse.json(
      { error: "ডেডলাইন তৈরি করতে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
