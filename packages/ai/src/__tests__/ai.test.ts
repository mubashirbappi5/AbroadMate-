import { describe, it, expect } from "vitest";
import {
  scrubSensitivePII,
  checkRateLimit,
  calculateTokenCost,
  OpenAIProviderService,
  SopProfileContext,
} from "../index";

describe("AbroadMate AI Provider & Guardrails", () => {
  it("scrubs sensitive PII (passport, NID, BD phone, email)", () => {
    const rawText = "আমার পাসপোর্ট নং A12345678, NID 1995123456789, ফোন 01712345678, ইমেইল student@example.com।";
    const scrubbed = scrubSensitivePII(rawText);

    expect(scrubbed).not.toContain("A12345678");
    expect(scrubbed).not.toContain("1995123456789");
    expect(scrubbed).not.toContain("01712345678");
    expect(scrubbed).not.toContain("student@example.com");

    expect(scrubbed).toContain("[PASSPORT_PROTECTED]");
    expect(scrubbed).toContain("[NID_PROTECTED]");
    expect(scrubbed).toContain("[PHONE_PROTECTED]");
    expect(scrubbed).toContain("[EMAIL_PROTECTED]");
  });

  it("enforces sliding window rate limits", () => {
    const key = `test-user-${Date.now()}`;
    const first = checkRateLimit(key, 3, 60000);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    checkRateLimit(key, 3, 60000);
    checkRateLimit(key, 3, 60000);

    const fourth = checkRateLimit(key, 3, 60000);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("calculates accurate token costs for gpt-4o-mini", () => {
    // 1,000,000 input tokens = $0.15; 1,000,000 output tokens = $0.60
    const cost = calculateTokenCost(1000, 1000, "gpt-4o-mini");
    expect(cost).toBeCloseTo(0.00075, 5);
  });

  it("generates authentic 5-section SOP grounded in verified student profile", async () => {
    const provider = new OpenAIProviderService();
    const context: SopProfileContext = {
      targetCountry: "GB",
      targetUniversity: "University of Manchester",
      targetProgram: "MSc Advanced Computer Science",
      degreeLevel: "MASTER",
      academicHistory: [
        {
          degree: "BSc in Computer Science & Engineering",
          institution: "BUET",
          cgpa: 3.82,
          graduationYear: 2024,
        },
      ],
      workExperience: [
        {
          role: "Software Engineer Intern",
          company: "Kite Games Studio",
          durationMonths: 6,
        },
      ],
      careerGoals: "বাংলাদেশে ফিরে এসে আধুনিক এআই টেকনোলজি ও উচ্চশিক্ষায় অবদান রাখা।",
      genuineMotivation: "গবেষণাধর্মী অ্যালগরিদম ও মেশিন লার্নিংয়ের বাস্তব প্রয়োগে জ্ঞানার্জন।",
    };

    const result = await provider.generateSopDraft(context);

    expect(result.title).toContain("MSc Advanced Computer Science");
    expect(result.sections.introductionMotivation).toBeDefined();
    expect(result.sections.academicBackground).toBeDefined();
    expect(result.sections.workResearchExperience).toBeDefined();
    expect(result.sections.whyThisUniversity).toBeDefined();
    expect(result.sections.careerGoalsContribution).toBeDefined();
    expect(result.wordCount).toBeGreaterThan(150);
  });

  it("detects missing information and alerts student rather than fabricating facts", async () => {
    const provider = new OpenAIProviderService();
    const incompleteContext: SopProfileContext = {
      targetCountry: "GB",
      targetUniversity: "University of Oxford",
      targetProgram: "MSc in Computer Science",
      degreeLevel: "MASTER",
      academicHistory: [],
      careerGoals: "", // Missing
      genuineMotivation: "", // Missing
    };

    const result = await provider.generateSopDraft(incompleteContext);

    expect(result.missingInformationAlerts.length).toBeGreaterThan(0);
    expect(result.followUpQuestionsBn.length).toBeGreaterThan(0);
  });

  it("edits a specific SOP section based on user instruction", async () => {
    const provider = new OpenAIProviderService();
    const editResult = await provider.editSopSection({
      sectionKey: "careerGoalsContribution",
      currentContent: "I plan to work in the tech industry upon graduation.",
      userInstruction: "বাংলাদেশে ডাটা সায়েন্স খাতে অবদান রাখার লক্ষ্য যুক্ত করুন।",
      context: {
        targetUniversity: "University of Manchester",
        targetProgram: "MSc Data Science",
      },
    });

    expect(editResult.sectionKey).toBe("careerGoalsContribution");
    expect(editResult.updatedContent).toBeDefined();
    expect(editResult.changeSummaryBn).toBeDefined();
  });

  it("polishes SOP tone and reports grammar improvement", async () => {
    const provider = new OpenAIProviderService();
    const toneResult = await provider.improveSopTone({
      fullContent: "I want to study master because I like computers and programming.",
      targetTone: "ACADEMIC",
    });

    expect(toneResult.toneApplied).toBe("ACADEMIC");
    expect(toneResult.improvementsSummaryBn).toContain("টোন");
  });

  it("evaluates and scores SOP structure against admissions rubric (1-100)", async () => {
    const provider = new OpenAIProviderService();
    const critique = await provider.critiqueSop({
      fullContent: "Sample academic SOP content with sufficient paragraphs and clear career path in Bangladesh...",
      targetUniversity: "University of Edinburgh",
      targetProgram: "MSc Artificial Intelligence",
    });

    expect(critique.overallScore).toBeGreaterThanOrEqual(1);
    expect(critique.overallScore).toBeLessThanOrEqual(100);
    expect(critique.strengthsBn.length).toBeGreaterThan(0);
    expect(critique.improvementPointsBn.length).toBeGreaterThan(0);
  });

  it("provides source-grounded assistant responses with official citations and limitations", async () => {
    const provider = new OpenAIProviderService();
    const chatResponse = await provider.chatWithContext({
      messages: [{ role: "user", content: "যুক্তরাজ্যের ভিসার জন্য ব্যাংকে কত টাকা দেখাতে হবে?" }],
      studentContext: {
        targetCountry: "GB",
        targetUniversity: "University of Leeds",
        targetProgram: "MSc Data Science",
        verifiedStatutoryRequirements: [
          {
            requirement: "UKVI 28-Day Bank Funds",
            amountOrDetail: "লন্ডনের বাইরে £১,৩৩৪/মাস হিসেবে ৯ মাসের লিভিং কস্ট + বাকি টিউশন ফি",
            sourceUrl: "https://www.gov.uk/student-visa/money",
            sourceOrg: "UK Visas and Immigration",
            verifiedDate: "2026-10-15",
          },
        ],
      },
    });

    expect(chatResponse.reply).toBeDefined();
    expect(chatResponse.citedSources.length).toBeGreaterThan(0);
    expect(chatResponse.citedSources[0]?.url).toContain("gov.uk");
    expect(chatResponse.limitations).toBeDefined();
  });
});
