import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { prisma, AppRole } from "@abroadmate/database";

const queueDefinitions = [
  {
    name: "deadline-reminders",
    labelBn: "ডেডলাইন রিমাইন্ডার কিউ",
    interval: "প্রতি ৬ ঘণ্টা (০ */৬ * * *)",
    description: "৩০, ১৪, ৭, ৩, ১ দিন ও কাস্টম নিয়মে অ্যালার্ট স্ক্যান",
    retries: 5,
    backoff: "Exponential (2s)",
  },
  {
    name: "scheduled-notifications",
    labelBn: "শিডিউলড নোটিফিকেশন",
    interval: "অন-ডিমান্ড / বিলম্বিত",
    description: "নির্ধারিত সময়ের নোটিশ ডেলিভারি ও অনবোর্ডিং ফলোআপ",
    retries: 3,
    backoff: "Exponential (5s)",
  },
  {
    name: "source-monitoring",
    labelBn: "সোর্স মনিটরিং কিউ",
    interval: "প্রতি ১২ ঘণ্টা (০ */১২ * * *)",
    description: "সরকারি সোর্স ইউআরএল ও রিভিউ মেয়াদোত্তীর্ণ পর্যবেক্ষণ",
    retries: 3,
    backoff: "Linear (10s)",
  },
  {
    name: "policy-change-detection",
    labelBn: "পলিসি চেঞ্জ ডিটেকশন",
    interval: "ইভেন্ট ড্রাইভেন",
    description: "পলিসি পরিবর্তনে শিক্ষার্থী রোডম্যাপ রি-ক্যালকুলেশন",
    retries: 5,
    backoff: "Exponential (3s)",
  },
  {
    name: "ai-document-generation",
    labelBn: "এআই ডকুমেন্ট জেনারেশন",
    interval: "ইউজার অ্যাকশন",
    description: "ব্যাকগ্রাউন্ডে নন-ব্লকিং SOP/মোটিভেশন লেটার তৈরি",
    retries: 3,
    backoff: "Exponential (5s)",
  },
  {
    name: "document-processing",
    labelBn: "ডকুমেন্ট প্রসেসিং কিউ",
    interval: "আপলোড ইভেন্ট",
    description: "ফাইল ভ্যালিডেশন, রেজোলিউশন ও রিভিউ কিউ প্লেসমেন্ট",
    retries: 3,
    backoff: "Exponential (2s)",
  },
  {
    name: "periodic-data-verification",
    labelBn: "পিরিয়ডিক ডেটা ভেরিফিকেশন",
    interval: "দৈনিক ০০:০০ UTC",
    description: "দৈনিক এক্সচেঞ্জ রেট অডিট ও ডেটা ইন্টিগ্রিটি চেক",
    retries: 3,
    backoff: "Fixed (30s)",
  },
  {
    name: "email-delivery",
    labelBn: "ইমেইল ডেলিভারি কিউ",
    interval: "ধারাবাহিক (Continuous)",
    description: "ট্রানজ্যাকশনাল এইচটিএমএল ইমেইল প্রেরণ ও বাউন্স হ্যান্ডলিং",
    retries: 5,
    backoff: "Exponential (2s)",
  },
];

export async function GET(request: NextRequest) {
  try {
    await requireRole([
      AppRole.SUPER_ADMIN,
      AppRole.DATA_MANAGER,
      AppRole.VERIFICATION_MANAGER,
      AppRole.SUPPORT_ADMIN,
    ]);

    // Fetch recent failed jobs from DLQ
    const failedJobs = await prisma.failedJobLog.findMany({
      take: 20,
      orderBy: { failedAt: "desc" },
    });

    const totalFailed = await prisma.failedJobLog.count();
    const unresolvedFailed = await prisma.failedJobLog.count({
      where: { isResolved: false },
    });

    // Count dispatched notifications in last 24 hours
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dispatchedLast24h = await prisma.notificationDispatchLog.count({
      where: { dispatchedAt: { gte: since24h } },
    });

    return NextResponse.json({
      success: true,
      data: {
        queues: queueDefinitions,
        stats: {
          totalQueues: 8,
          activeWorkers: 8,
          dispatchedLast24h,
          totalFailed,
          unresolvedFailed,
        },
        deadLetterQueue: failedJobs,
      },
    });
  } catch (error: any) {
    const status = error.message?.includes("FORBIDDEN")
      ? 403
      : error.message?.includes("UNAUTHORIZED")
      ? 401
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || "জব কিউ তথ্য লোড করতে ব্যর্থ হয়েছে।" },
      { status }
    );
  }
}
