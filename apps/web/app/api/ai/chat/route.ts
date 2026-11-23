import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { prisma } from "@abroadmate/database";
import { aiChatSchema } from "@abroadmate/validation";
import { aiProvider, checkRateLimit } from "@abroadmate/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = session ? `user:${session.user.id}` : `ip:${clientIp}`;

    const limit = checkRateLimit(`chat:${rateLimitKey}`, 30, 3600000); // 30 per hour
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "আপনার চ্যাট রিকুয়েস্ট সীমা শেষ হয়েছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parseResult = aiChatSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "ভুল ইনপুট ফরম্যাট।", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { messages, conversationId } = parseResult.data;
    const userId = session?.user?.id;

    // Assemble comprehensive grounding context from PostgreSQL
    let studentContext: any = {};

    if (userId) {
      const [profile, goal, roadmap, deadlines, financialRules] = await Promise.all([
        prisma.studentProfile.findUnique({
          where: { userId },
          include: {
            academicRecords: { take: 1, orderBy: { passingYear: "desc" } },
            languageTests: { take: 1, orderBy: { testDate: "desc" } },
          },
        }),
        prisma.userGoal.findFirst({ where: { userId } }),
        prisma.roadmap.findFirst({
          where: { userId },
          include: {
            university: { select: { nameEn: true, nameBn: true } },
            program: { select: { titleEn: true, titleBn: true } },
          },
        }),
        prisma.deadline.findMany({
          where: {
            isCompleted: false,
            OR: [{ isGlobal: true }, { userId }],
          },
          take: 3,
          orderBy: { deadlineDate: "asc" },
        }),
        prisma.visaFinancialRule.findMany({
          take: 3,
          orderBy: { effectiveDate: "desc" },
        }),
      ]);

      const now = new Date();
      studentContext = {
        degreeLevel: profile?.targetDegreeLevel || goal?.targetDegreeLevel || "MASTER",
        cgpa: profile?.academicRecords?.[0]?.gpaOrCgpa || null,
        ieltsOverall: profile?.languageTests?.[0]?.overallScore || null,
        targetCountry: goal?.targetCountryCodes?.[0] || roadmap?.targetCountryCode || "GB",
        targetUniversity: roadmap?.university?.nameEn || undefined,
        targetProgram: roadmap?.program?.titleEn || goal?.targetMajor || undefined,
        fundingChoice: roadmap?.fundingChoice || "SELF_FUNDED",
        currentRoadmapPhase: roadmap ? `ধাপ ${roadmap.currentStageNumber}` : undefined,
        upcomingDeadlines: deadlines.map((d) => ({
          titleBn: d.titleBn,
          daysRemaining: Math.max(0, Math.ceil((new Date(d.deadlineDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))),
        })),
      };

      if (financialRules.length > 0) {
        studentContext.verifiedStatutoryRequirements = financialRules.map((r) => ({
          requirement: "সরকারি ভিসা সলভেন্সি বিধান",
          amountOrDetail: `${r.requiredLivingFunds} ${r.fundsCurrencyCode} (${r.maintenancePeriodDays}-দিনের ব্যাংক ফান্ড)`,
          sourceUrl: r.sourceUrl || "https://www.gov.uk/student-visa/money",
          sourceOrg: "Immigration Authority",
          verifiedDate: r.effectiveDate.toISOString().split("T")[0] ?? "2026-10-15",
        }));
      }
    }

    const startTime = Date.now();
    const aiResponse = await aiProvider.chatWithContext({
      messages: messages as any,
      studentContext,
    });
    const latencyMs = Date.now() - startTime;

    // Persist conversation and message if user is authenticated
    let activeConvId = conversationId;

    if (userId) {
      await prisma.$transaction(async (tx) => {
        let conv;
        if (activeConvId) {
          conv = await tx.aIConversation.findUnique({
            where: { id: activeConvId },
          });
        }

        if (!conv) {
          const firstUserMsg = messages.find((m) => m.role === "user")?.content || "নতুন কথোপকথন";
          conv = await tx.aIConversation.create({
            data: {
              userId,
              title: firstUserMsg.slice(0, 40),
              targetCountry: studentContext.targetCountry || "GB",
            },
          });
          activeConvId = conv.id;
        }

        // Save assistant message
        await tx.aIMessage.create({
          data: {
            conversationId: conv.id,
            role: "assistant",
            content: aiResponse.reply,
            citedSourcesJson: JSON.stringify(aiResponse.citedSources),
            tokenUsage: aiResponse.tokensUsed.totalTokens,
          },
        });

        // Log token telemetry
        await tx.aITokenUsageLog.create({
          data: {
            userId,
            featureName: "CHAT_ASSISTANT",
            modelName: "gpt-4o-mini",
            promptTokens: aiResponse.tokensUsed.promptTokens,
            completionTokens: aiResponse.tokensUsed.completionTokens,
            totalTokens: aiResponse.tokensUsed.totalTokens,
            estimatedCostUsd: aiResponse.estimatedCostUsd,
            latencyMs,
          },
        });
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: aiResponse.reply,
        citedSources: aiResponse.citedSources,
        applicableRequirement: aiResponse.applicableRequirement,
        limitations: aiResponse.limitations,
        conversationId: activeConvId,
        studentContextApplied: {
          targetCountry: studentContext.targetCountry,
          targetProgram: studentContext.targetProgram,
          degreeLevel: studentContext.degreeLevel,
        },
      },
    });
  } catch (error: any) {
    console.error("AI Chat Assistant error:", error);
    return NextResponse.json(
      { error: "এআই সহায়ক সিস্টেমে সমস্যা হয়েছে।", message: error.message },
      { status: 500 }
    );
  }
}
