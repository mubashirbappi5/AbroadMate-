import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@abroadmate/database";
import { COUNTRY_VISA_GUIDES, generateCountryWorkflow } from "@abroadmate/visa-engine";
import { CountryCodeType } from "@abroadmate/validation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const upperCode = code.toUpperCase() as CountryCodeType;

    const fallbackGuide = COUNTRY_VISA_GUIDES[upperCode];
    if (!fallbackGuide) {
      return NextResponse.json(
        { error: "অননুমোদিত বা অকার্যকর দেশ কোড।" },
        { status: 404 }
      );
    }

    // Attempt to fetch from DB if available
    let dbGuide = null;
    let dbVisaType = null;
    let workflowSteps = generateCountryWorkflow(upperCode);

    try {
      dbGuide = await prisma.countryVisaGuide.findUnique({
        where: { countryCode: upperCode },
      });

      dbVisaType = await prisma.visaType.findFirst({
        where: { countryCode: upperCode },
        include: {
          requirements: {
            where: { isCurrentActive: true },
            include: {
              versions: {
                where: { isArchived: false },
                include: {
                  financialRules: true,
                  documentRequirements: true,
                  generalRequirements: true,
                },
              },
            },
          },
        },
      });
    } catch {
      // Fallback gracefully to code engine if DB is cold
    }

    return NextResponse.json({
      success: true,
      countryCode: upperCode,
      guide: fallbackGuide,
      dbGuide,
      visaType: dbVisaType,
      workflowSteps,
      lastVerifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch visa guide:", error);
    return NextResponse.json(
      { error: "ভিসা নির্দেশিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
