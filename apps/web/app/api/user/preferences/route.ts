import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { notificationPreferencesSchema } from "@abroadmate/validation";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();

    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          deadlineAlertsEmail: true,
          deadlineAlertsWeb: true,
          scholarshipAlerts: true,
          visaRuleUpdates: true,
          weeklyRoadmapChecklist: false,
          telegramAlerts: false,
          customReminderDays: [30, 14, 7, 3, 1],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "সেটিংস লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const parseResult = notificationPreferencesSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    const updated = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        deadlineAlertsEmail: data.deadlineAlertsEmail,
        deadlineAlertsWeb: data.deadlineAlertsWeb,
        scholarshipAlerts: data.scholarshipAlerts,
        visaRuleUpdates: data.visaRuleUpdates,
        weeklyRoadmapChecklist: data.weeklyRoadmapChecklist,
        telegramAlerts: data.telegramAlerts,
        telegramChatId: data.telegramChatId || null,
        customReminderDays: data.customReminderDays,
      },
      create: {
        userId: session.user.id,
        deadlineAlertsEmail: data.deadlineAlertsEmail,
        deadlineAlertsWeb: data.deadlineAlertsWeb,
        scholarshipAlerts: data.scholarshipAlerts,
        visaRuleUpdates: data.visaRuleUpdates,
        weeklyRoadmapChecklist: data.weeklyRoadmapChecklist,
        telegramAlerts: data.telegramAlerts,
        telegramChatId: data.telegramChatId || null,
        customReminderDays: data.customReminderDays,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "নোটিফিকেশন ও ডেডলাইন রিমাইন্ডার সেটিংস সফলভাবে সংরক্ষিত হয়েছে।",
    });
  } catch (error: any) {
    const status = error.message?.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json(
      { success: false, error: error.message || "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
