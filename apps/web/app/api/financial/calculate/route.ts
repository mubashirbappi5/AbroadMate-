import { NextRequest, NextResponse } from "next/server";
import { calculateFinancialBudgetSchema } from "@abroadmate/validation";
import { calculateFullBudgetPlan } from "@abroadmate/shared";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = calculateFinancialBudgetSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "ভুল ইনপুট ফরম্যাট।",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const plan = calculateFullBudgetPlan(parseResult.data);

    return NextResponse.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Budget calculation failed:", error);
    return NextResponse.json(
      { error: "বাজেট হিসাব করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
