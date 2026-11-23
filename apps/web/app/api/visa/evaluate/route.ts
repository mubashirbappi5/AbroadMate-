import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";
import { evaluateVisaAssessmentSchema } from "@abroadmate/validation";
import { evaluateStudentVisaEligibility } from "@abroadmate/visa-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = evaluateVisaAssessmentSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const evaluation = evaluateStudentVisaEligibility(parseResult.data);

    // If userId or authorization header is provided, log the assessment audit
    const userIdHeader = request.headers.get("x-user-id");
    if (userIdHeader) {
      try {
        const userExists = await prisma.user.findUnique({
          where: { id: userIdHeader },
          select: { id: true },
        });

        if (userExists) {
          await prisma.visaAssessmentLog.create({
            data: {
              userId: userExists.id,
              countryCode: evaluation.countryCode,
              visaCode: evaluation.visaCode,
              verdictStatus: evaluation.verdict,
              tuitionRemaining: evaluation.financialBreakdown.tuitionRemainingLocal,
              livingFundsRequired: evaluation.financialBreakdown.livingFundsRequiredLocal,
              totalFundsRequired: evaluation.financialBreakdown.totalFundsRequiredLocal,
              availableFundsTotal: evaluation.financialBreakdown.availableLiquidFundsLocal,
              financialGapAmount: evaluation.financialBreakdown.financialGapLocal,
              currencyCode: evaluation.financialBreakdown.currencyCode,
              summaryBn: evaluation.summaryBn,
              missingRequirementsJson: JSON.stringify(
                evaluation.requirementResults.filter((r) => r.status === "MISSING")
              ),
              missingDocumentsJson: JSON.stringify(
                evaluation.documentChecklist.filter((d) => d.status === "MISSING")
              ),
            },
          });
        }
      } catch (logError) {
        console.warn("Could not save visa assessment log:", logError);
      }
    }

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error("Visa evaluation failed:", error);
    return NextResponse.json(
      { error: "ভিসা যোগ্যতা মূল্যায়ন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
