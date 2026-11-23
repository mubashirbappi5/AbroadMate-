import { NextRequest, NextResponse } from "next/server";
import { calculateVisaFinancialsSchema } from "@abroadmate/validation";
import { calculateDetailedFinancialProof } from "@abroadmate/visa-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = calculateVisaFinancialsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const calculation = calculateDetailedFinancialProof({
      countryCode: parseResult.data.countryCode,
      tuitionFeeLocal: parseResult.data.tuitionFeeLocal,
      tuitionPaidLocal: parseResult.data.tuitionPaidLocal,
      isInsideLondon: parseResult.data.isInsideLondon,
      dependentSpouseCount: parseResult.data.dependentSpouseCount,
      dependentChildCount: parseResult.data.dependentChildCount,
    });

    return NextResponse.json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    console.error("Financial calculation failed:", error);
    return NextResponse.json(
      { error: "আর্থিক হিসাব সম্পন্ন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
