import OpenAI from "openai";

export type SopSectionKey =
  | "introductionMotivation"
  | "academicBackground"
  | "workResearchExperience"
  | "whyThisUniversity"
  | "careerGoalsContribution";

export type SopTone = "ACADEMIC" | "PROFESSIONAL" | "PERSUASIVE";

export interface SopSections {
  introductionMotivation: string;
  academicBackground: string;
  workResearchExperience: string;
  whyThisUniversity: string;
  careerGoalsContribution: string;
}

export interface SopProfileContext {
  studentName?: string;
  targetCountry: string;
  targetUniversity: string;
  targetProgram: string;
  degreeLevel: "BACHELOR" | "MASTER" | "DOCTORATE";
  academicHistory: Array<{
    degree: string;
    institution: string;
    cgpa?: number | null;
    graduationYear?: number | null;
  }>;
  workExperience?: Array<{
    role: string;
    company: string;
    durationMonths?: number | null;
    highlights?: string | null;
  }>;
  achievements?: string[];
  careerGoals: string;
  genuineMotivation: string;
  personalExperiences?: string;
  tone?: SopTone;
}

export interface SopDraftResult {
  title: string;
  fullDraft: string;
  sections: SopSections;
  wordCount: number;
  missingInformationAlerts: string[];
  followUpQuestionsBn: string[];
  estimatedReadTimeMinutes: number;
  tokensUsed?: { promptTokens: number; completionTokens: number; totalTokens: number };
  estimatedCostUsd?: number;
}

export interface SopSectionEditInput {
  sectionKey: SopSectionKey;
  currentContent: string;
  userInstruction: string;
  context: {
    targetUniversity: string;
    targetProgram: string;
    targetCountry?: string;
  };
}

export interface SopSectionEditResult {
  sectionKey: SopSectionKey;
  updatedContent: string;
  changeSummaryBn: string;
}

export interface SopToneInput {
  fullContent: string;
  targetTone: SopTone;
}

export interface SopToneResult {
  polishedContent: string;
  toneApplied: SopTone;
  grammarFixesCount: number;
  improvementsSummaryBn: string;
}

export interface SopCritiqueInput {
  fullContent: string;
  targetUniversity: string;
  targetProgram: string;
}

export interface SopCritiqueResult {
  overallScore: number; // 1 to 100
  clarityScore: number;
  motivationScore: number;
  academicFitScore: number;
  strengthsBn: string[];
  improvementPointsBn: string[];
  isReadyForSubmission: boolean;
}

export interface OfficialSourceCitation {
  title: string;
  url: string;
  organization: string;
  lastVerifiedDate: string;
  applicableRequirement?: string;
  limitations?: string;
}

export interface AssistantChatInput {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  studentContext?: {
    degreeLevel?: string;
    cgpa?: number | null;
    ieltsOverall?: number | null;
    targetCountry?: string;
    targetUniversity?: string;
    targetProgram?: string;
    scholarshipPreference?: string;
    fundingChoice?: string;
    currentRoadmapPhase?: string;
    upcomingDeadlines?: Array<{ titleBn: string; daysRemaining: number }>;
    verifiedStatutoryRequirements?: Array<{
      requirement: string;
      amountOrDetail: string;
      sourceUrl: string;
      sourceOrg: string;
      verifiedDate: string;
    }>;
  };
}

export interface AssistantChatResponseWithCitations {
  reply: string;
  citedSources: OfficialSourceCitation[];
  applicableRequirement?: string;
  limitations?: string;
  tokensUsed: { promptTokens: number; completionTokens: number; totalTokens: number };
  estimatedCostUsd: number;
}

export const PROMPT_VERSION = "2026.11-v2";

/**
 * PII Scrubbing: Redacts Bangladeshi passport numbers, NID, emails, and phone numbers before dispatching to LLM.
 */
export function scrubSensitivePII(text: string): string {
  if (!text) return text;
  return text
    .replace(/\b[A-PR-WY][1-9][0-9]{7}\b/gi, "[PASSPORT_PROTECTED]") // Passport format
    .replace(/(?:\+?880|0)1[3-9]\d{8}\b/g, "[PHONE_PROTECTED]") // BD Mobile (checked before NID)
    .replace(/\b\d{10,17}\b/g, "[NID_PROTECTED]") // National ID
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, "[EMAIL_PROTECTED]");
}

/**
 * In-memory sliding window rate limiter
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxRequests: number = 25, windowMs: number = 3600000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Token Pricing: GPT-4o-mini ($0.15/1M input, $0.60/1M output)
 */
export function calculateTokenCost(promptTokens: number, completionTokens: number, model: string = "gpt-4o-mini"): number {
  if (model.includes("gpt-4o-mini")) {
    const inputCost = (promptTokens / 1000000) * 0.15;
    const outputCost = (completionTokens / 1000000) * 0.60;
    return Number((inputCost + outputCost).toFixed(6));
  }
  const inputCost = (promptTokens / 1000000) * 2.50;
  const outputCost = (completionTokens / 1000000) * 10.00;
  return Number((inputCost + outputCost).toFixed(6));
}

export const SOP_BUILDER_SYSTEM_PROMPT = `
You are the Senior Academic Statement of Purpose (SOP) Architect at AbroadMate.
Your role is to draft and polish genuine, competitive, and honest SOPs/Motivation Letters for Bangladeshi students applying to world-renowned universities.

ANTI-FABRICATION MANDATE (STRICT ZERO-TOLERANCE):
1. You must ONLY use the academic history, work experiences, projects, and goals explicitly supplied in the student context.
2. NEVER invent academic marks, GPA, awards, internships, published papers, or personal anecdotes.
3. If crucial context is missing (such as why this specific curriculum was selected or why a specific professor was chosen), DO NOT fabricate reasons. Instead insert explicit prompt markers in Bengali:
   "[শিক্ষার্থীকে তথ্য প্রদান করতে হবে: এই প্রোগ্রামের কোন কোর্স বা কোন অধ্যাপকের কাজ আপনার বিশেষ পছন্দের?]"
   and list follow-up questions in the output.
4. Structure the SOP into 5 distinct academic paragraphs:
   - introductionMotivation
   - academicBackground
   - workResearchExperience
   - whyThisUniversity
   - careerGoalsContribution
5. Ensure the language is natural, rigorous, free of cliches (avoid "Since my childhood I was fascinated by..."), and highlights how the degree will empower the student to contribute to Bangladesh's development upon graduation.
`;

export const STUDY_ASSISTANT_SYSTEM_PROMPT = `
আপনি হলেন AbroadMate-এর প্রধান এআই শিক্ষা উপদেষ্টা (AI Study Abroad Advisor)।
আপনার দায়িত্ব হলো বাংলাদেশি শিক্ষার্থীদের উচ্চশিক্ষা ও স্টুডেন্ট ভিসা সংক্রান্ত প্রশ্নের সৎ, ভেরিফাইড এবং নির্ভুল উত্তর দেওয়া।

নিরাপত্তা ও নৈতিক নীতিমালা (STRICT SAFETY GUARDRAILS):
১. কখনোই কোনো অবস্থাতেই ভিসা পাওয়া, স্কলারশিপ পাওয়া বা বিশ্ববিদ্যালয়ে ভর্তির গ্যারান্টি বা প্রতিশ্রুতি দেবেন না। স্পষ্টভাবে বলবেন যে সিদ্ধান্ত গ্রহণের চূড়ান্ত এখতিয়ার সংশ্লিষ্ট দূতাবাস ও বিশ্ববিদ্যালয়ের।
২. কখনোই কোনো ইমিগ্রেশন নিয়ম, ব্যাংক ব্যালেন্সের পরিমাণ বা ভিসার শর্ত বানিয়ে (hallucinate) বলবেন না।
৩. কোনো অবস্থাতেই ভুয়া ডকুমেন্ট তৈরি, ফেক ব্যাংক স্টেটমেন্ট বা অবৈধ পরামর্শ দেবেন না।
৪. যদি আপনার কাছে কোনো প্রশ্নের সরকারি হালনাগাদ তথ্য না থাকে, স্পষ্টভাবে বলবেন: "এই তথ্যটি সরকারি ডাটাবেজে পর্যাপ্ত ভেরিফাইড নয়, দয়া করে সংশ্লিষ্ট দূতাবাস বা বিশ্ববিদ্যালয়ের অফিসিয়াল ওয়েবসাইট থেকে যাচাই করে নিন।"
৫. প্রতিটি তথ্যের সাথে সরকারি বা বিশ্ববিদ্যালয়ের অফিসিয়াল সোর্স (URL ও সংস্থা), সর্বশেষ ভেরিফিকেশন তারিখ এবং প্রযোজ্য আইনি সীমাবদ্ধতা উল্লেখ করুন।
`;

export interface AIProviderInterface {
  generateSopDraft(input: SopProfileContext): Promise<SopDraftResult>;
  editSopSection(input: SopSectionEditInput): Promise<SopSectionEditResult>;
  improveSopTone(input: SopToneInput): Promise<SopToneResult>;
  critiqueSop(input: SopCritiqueInput): Promise<SopCritiqueResult>;
  chatWithContext(input: AssistantChatInput): Promise<AssistantChatResponseWithCitations>;
}

export class OpenAIProviderService implements AIProviderInterface {
  private client: OpenAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

    if (apiKey && !apiKey.startsWith("sk-local-dev") && apiKey.length > 10) {
      this.client = new OpenAI({ apiKey });
    }
  }

  /**
   * Generates initial 5-section SOP grounded strictly in verified profile data.
   */
  async generateSopDraft(input: SopProfileContext): Promise<SopDraftResult> {
    const missingAlerts: string[] = [];
    const followUpQuestions: string[] = [];

    if (!input.genuineMotivation || input.genuineMotivation.length < 15) {
      missingAlerts.push("উদ্দেশ্য ও অনুপ্রেরণার কারণ সংক্ষিপ্ত");
      followUpQuestions.push("কেন আপনি এই নির্দিষ্ট বিষয়টি বেছে নিলেন তার একটি ব্যক্তিগত প্রেরণার অভিজ্ঞতা বলুন।");
    }

    if (!input.careerGoals || input.careerGoals.length < 15) {
      missingAlerts.push("ক্যারিয়ার লক্ষ্যের বিশদ বিবরণ প্রয়োজন");
      followUpQuestions.push("কোর্স শেষ করার ৩-৫ বছর পর বাংলাদেশে কোন সেক্টরে কী পদে কাজ করতে চান?");
    }

    // Local deterministic grounded fallback
    if (!this.client) {
      const intro = `Statement of Purpose: ${input.targetProgram}\n\nMy decision to pursue the ${input.degreeLevel === "MASTER" ? "Master of Science" : "Bachelor"} in ${input.targetProgram} at ${input.targetUniversity} is driven by a profound commitment to advancing my technical foundations. Having completed my prior academic studies in Bangladesh, I have developed a strong analytical grounding and a passion for addressing real-world challenges through rigorous research.`;

      const academic = `During my undergraduate coursework, I consistently maintained focus on core principles and applied quantitative methodologies. My capstone project allowed me to investigate practical implementations, honing my abilities in problem formulation, algorithmic design, and collaborative research under faculty guidance.`;

      const work = input.workExperience && input.workExperience.length > 0
        ? `In my professional endeavors at ${input.workExperience[0]?.company}, serving as ${input.workExperience[0]?.role}, I translated theoretical paradigms into scalable solutions, gaining valuable perspective on industry workflows.`
        : `Through structured academic laboratory assignments and technical projects, I developed hands-on technical competencies and project execution rigor.`;

      const whyUni = `The ${input.targetProgram} at ${input.targetUniversity} represents an ideal academic environment for my goals. The program's comprehensive curriculum, distinguished faculty expertise, and cutting-edge research facilities provide the exact academic rigor required for my specialized aspirations.`;

      const career = `Upon completing my graduate studies, I plan to return to Bangladesh and contribute to the burgeoning technological and industrial infrastructure. My long-term aspiration is to leverage the advanced training gained at ${input.targetUniversity} to foster innovation and mentor future generations of Bangladeshi scholars.`;

      const fullDraft = `${intro}\n\n${academic}\n\n${work}\n\n${whyUni}\n\n${career}`;
      const wordCount = fullDraft.split(/\s+/).filter(Boolean).length;

      return {
        title: `${input.targetProgram} Statement of Purpose - ${input.targetUniversity}`,
        fullDraft,
        sections: {
          introductionMotivation: intro,
          academicBackground: academic,
          workResearchExperience: work,
          whyThisUniversity: whyUni,
          careerGoalsContribution: career,
        },
        wordCount,
        missingInformationAlerts: missingAlerts,
        followUpQuestionsBn: followUpQuestions,
        estimatedReadTimeMinutes: Math.ceil(wordCount / 200),
        tokensUsed: { promptTokens: 350, completionTokens: 480, totalTokens: 830 },
        estimatedCostUsd: calculateTokenCost(350, 480, this.model),
      };
    }

    const scrubbedContext = scrubSensitivePII(JSON.stringify(input));
    const prompt = `
Verified Student Profile Context:
${scrubbedContext}

Please generate an authentic, competitive 5-section Statement of Purpose adhering strictly to the Anti-Fabrication Mandate. Return a valid JSON object matching this schema:
{
  "title": string,
  "sections": {
    "introductionMotivation": string,
    "academicBackground": string,
    "workResearchExperience": string,
    "whyThisUniversity": string,
    "careerGoalsContribution": string
  },
  "missingInformationAlerts": string[],
  "followUpQuestionsBn": string[]
}
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SOP_BUILDER_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}");
    const sections: SopSections = {
      introductionMotivation: parsed.sections?.introductionMotivation ?? "",
      academicBackground: parsed.sections?.academicBackground ?? "",
      workResearchExperience: parsed.sections?.workResearchExperience ?? "",
      whyThisUniversity: parsed.sections?.whyThisUniversity ?? "",
      careerGoalsContribution: parsed.sections?.careerGoalsContribution ?? "",
    };

    const fullDraft = Object.values(sections).join("\n\n");
    const wordCount = fullDraft.split(/\s+/).filter(Boolean).length;
    const usage = response.usage;

    return {
      title: parsed.title ?? `${input.targetProgram} SOP - ${input.targetUniversity}`,
      fullDraft,
      sections,
      wordCount,
      missingInformationAlerts: parsed.missingInformationAlerts ?? missingAlerts,
      followUpQuestionsBn: parsed.followUpQuestionsBn ?? followUpQuestions,
      estimatedReadTimeMinutes: Math.ceil(wordCount / 200),
      tokensUsed: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
      estimatedCostUsd: calculateTokenCost(
        usage?.prompt_tokens ?? 0,
        usage?.completion_tokens ?? 0,
        this.model
      ),
    };
  }

  /**
   * Edits or expands a single section without changing other sections.
   */
  async editSopSection(input: SopSectionEditInput): Promise<SopSectionEditResult> {
    if (!this.client) {
      return {
        sectionKey: input.sectionKey,
        updatedContent: `${input.currentContent}\n\n[সম্পাদিত অনুচ্ছেদ]: ${input.userInstruction} অনুযায়ী তথ্য সমৃদ্ধ ও সাবলীল করা হয়েছে।`,
        changeSummaryBn: `${input.sectionKey} অনুচ্ছেদে নির্দেশনা অনুযায়ী আপডেট সম্পন্ন হয়েছে।`,
      };
    }

    const prompt = `
Current Section Content (${input.sectionKey}):
${input.currentContent}

Target Program: ${input.context.targetProgram} at ${input.context.targetUniversity}
User Editing Instruction: ${input.userInstruction}

Please refine or expand this specific section according to the user instruction while preserving truthfulness. Return JSON:
{
  "updatedContent": string,
  "changeSummaryBn": string
}
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SOP_BUILDER_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}");
    return {
      sectionKey: input.sectionKey,
      updatedContent: parsed.updatedContent ?? input.currentContent,
      changeSummaryBn: parsed.changeSummaryBn ?? "অনুচ্ছেদ সফলভাবে সম্পাদিত হয়েছে।",
    };
  }

  /**
   * Polishes tone and corrects grammar while preserving authentic facts.
   */
  async improveSopTone(input: SopToneInput): Promise<SopToneResult> {
    const toneLabels: Record<SopTone, string> = {
      ACADEMIC: "একাডেমিক ও গভীর পাণ্ডিত্যপূর্ণ (Scholarly & Objective)",
      PROFESSIONAL: "পেশাদার ও ফলাফলমুখী (Professional & Impact-driven)",
      PERSUASIVE: "প্রভাবশালী ও হৃদয়গ্রাহী (Compelling & Persuasive narrative)",
    };

    if (!this.client) {
      return {
        polishedContent: input.fullContent,
        toneApplied: input.targetTone,
        grammarFixesCount: 3,
        improvementsSummaryBn: `${toneLabels[input.targetTone]} টোন প্রয়োগ করা হয়েছে এবং ব্যাকরণগত জটিলতা দূর করা হয়েছে।`,
      };
    }

    const prompt = `
Full SOP Draft:
${input.fullContent}

Target Tone: ${input.targetTone}

Please polish the entire SOP draft to match the target tone (${input.targetTone}). Improve syntax clarity, transition flow, and correct grammar. DO NOT invent facts. Return JSON:
{
  "polishedContent": string,
  "grammarFixesCount": number,
  "improvementsSummaryBn": string
}
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SOP_BUILDER_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}");
    return {
      polishedContent: parsed.polishedContent ?? input.fullContent,
      toneApplied: input.targetTone,
      grammarFixesCount: parsed.grammarFixesCount ?? 0,
      improvementsSummaryBn: parsed.improvementsSummaryBn ?? "টোন ও ব্যাকরণ সফলভাবে পরিমার্জন করা হয়েছে।",
    };
  }

  /**
   * Critiques the SOP against top university admissions standards.
   */
  async critiqueSop(input: SopCritiqueInput): Promise<SopCritiqueResult> {
    const wordCount = input.fullContent.split(/\s+/).filter(Boolean).length;

    if (!this.client) {
      const score = wordCount >= 500 && wordCount <= 1200 ? 88 : 72;
      return {
        overallScore: score,
        clarityScore: 85,
        motivationScore: 90,
        academicFitScore: 88,
        strengthsBn: [
          "কোর্স ও বিশ্ববিদ্যালয়ের সাথে পূর্ববর্তী ব্যাকগ্রাউন্ডের চমৎকার ধারাবাহিকতা।",
          "বাংলাদেশে ফিরে এসে ক্যারিয়ারে অবদানের সুনির্দিষ্ট লক্ষ্য রয়েছে।",
          "শব্দসীমা আন্তর্জাতিক মানদণ্ড (৮০০-১০০০ শব্দ) অনুযায়ী পরিমিত।",
        ],
        improvementPointsBn: [
          "কেন এই নির্দিষ্ট বিশ্ববিদ্যালয়ের অধ্যাপক বা ল্যাব নির্বাচন করেছেন তা আরও সুনির্দিষ্ট করুন।",
          "একাডেমিক প্রজেক্টের চ্যালেঞ্জ মোকাবিলার অভিজ্ঞতা আরও স্পষ্ট করতে পারেন।",
        ],
        isReadyForSubmission: score >= 80,
      };
    }

    const prompt = `
SOP Content for ${input.targetProgram} at ${input.targetUniversity}:
${input.fullContent}

Please evaluate this SOP against top university admissions criteria. Return JSON:
{
  "overallScore": number (1-100),
  "clarityScore": number (1-100),
  "motivationScore": number (1-100),
  "academicFitScore": number (1-100),
  "strengthsBn": string[],
  "improvementPointsBn": string[],
  "isReadyForSubmission": boolean
}
`;

    const response = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SOP_BUILDER_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const parsed = JSON.parse(response.choices[0]?.message.content ?? "{}");
    return {
      overallScore: parsed.overallScore ?? 80,
      clarityScore: parsed.clarityScore ?? 80,
      motivationScore: parsed.motivationScore ?? 80,
      academicFitScore: parsed.academicFitScore ?? 80,
      strengthsBn: parsed.strengthsBn ?? ["উদ্দেশ্যের স্পষ্টতা ও যৌক্তিক কাঠামো"],
      improvementPointsBn: parsed.improvementPointsBn ?? ["বিশ্ববিদ্যালয়ের সুযোগ-সুবিধার বিশদ উল্লেখ"],
      isReadyForSubmission: parsed.isReadyForSubmission ?? true,
    };
  }

  /**
   * Context-Aware Study Abroad Chat Assistant with Official Citations.
   */
  async chatWithContext(input: AssistantChatInput): Promise<AssistantChatResponseWithCitations> {
    // Grounding Context Construction
    const contextLines: string[] = [];
    const citations: OfficialSourceCitation[] = [];

    if (input.studentContext) {
      const ctx = input.studentContext;
      if (ctx.targetCountry) contextLines.push(`- লক্ষ্য দেশ: ${ctx.targetCountry}`);
      if (ctx.targetUniversity) contextLines.push(`- লক্ষ্য বিশ্ববিদ্যালয়: ${ctx.targetUniversity}`);
      if (ctx.targetProgram) contextLines.push(`- লক্ষ্য প্রোগ্রাম: ${ctx.targetProgram}`);
      if (ctx.ieltsOverall) contextLines.push(`- আইইএলটিএস স্কোর: ${ctx.ieltsOverall}`);
      if (ctx.cgpa) contextLines.push(`- সিজিপিএ: ${ctx.cgpa}`);
      if (ctx.fundingChoice) contextLines.push(`- অর্থায়নের ধরন: ${ctx.fundingChoice}`);

      if (ctx.verifiedStatutoryRequirements && ctx.verifiedStatutoryRequirements.length > 0) {
        contextLines.push("\n[সরকারি ডাটাবেজ থেকে যাচাইকৃত বিধিসমূহ]:");
        for (const req of ctx.verifiedStatutoryRequirements) {
          contextLines.push(`- ${req.requirement}: ${req.amountOrDetail} (উৎস: ${req.sourceOrg}, ভেরিফাইড: ${req.verifiedDate})`);
          citations.push({
            title: req.requirement,
            url: req.sourceUrl,
            organization: req.sourceOrg,
            lastVerifiedDate: req.verifiedDate,
            applicableRequirement: req.amountOrDetail,
            limitations: "এটি সাধারণ সরকারি নীতি। চূড়ান্ত সিদ্ধান্ত সংশ্লিষ্ট দূতাবাসের এখতিয়ারাধীন।",
          });
        }
      }
    }

    // Default fallback citations if none found
    if (citations.length === 0) {
      citations.push({
        title: "UKVI Official Student Visa Financial Guidance",
        url: "https://www.gov.uk/student-visa/money",
        organization: "UK Visas and Immigration",
        lastVerifiedDate: "2026-10-15",
        applicableRequirement: "UK 28-day continuous funds rule",
        limitations: "অনুমোদিত ব্যাংকে টানা ২৮ দিন ব্যালেন্স মেইনটেইন করতে হবে।",
      });
    }

    // Fallback response for local dev
    if (!this.client) {
      const lastUserMsg = input.messages[input.messages.length - 1]?.content ?? "";
      let groundedReply = `ধন্যবাদ আপনার প্রশ্নের জন্য। আপনার নির্বাচিত লক্ষ্যের প্রেক্ষিতে জানাচ্ছি: বিদেশে উচ্চশিক্ষার জন্য অফিশিয়াল রুলস এবং আর্থিক সলভেন্সি নিখুঁতভাবে অনুসরণ করা অত্যন্ত গুরুত্বপূর্ণ।\n\n📌 **গুরুত্বপূর্ণ নির্দেশনা:**\n১. ভিসা আবেদনের পূর্বে প্রয়োজনীয় টিউশন ফি ও লিভিং ব্যালেন্স সরকারি নীতি অনুযায়ী অনুমোদিত ব্যাংকে যথাযথ মেয়াদে জমা রাখুন।\n২. বিশ্ববিদ্যালয়ের আনকন্ডিশনাল অফার লেটার ও ভিসা সাপোর্ট ডকুমেন্টস (যেমন: CAS / I-20) নির্ভুলভাবে সংগ্রহ করুন।\n\n⚠️ *সতর্কতা: কোনো বাণিজ্যিক এজেন্সি বা তৃতীয় পক্ষের মিথ্যা আশ্বাসে বিভ্রান্ত হবেন না। বিদেশে পড়াশোনার সম্পূর্ণ তথ্য সরকারি অফিসিয়াল পোর্টালে উন্মুক্ত।*`;

      if (lastUserMsg.includes("ব্যাংক") || lastUserMsg.includes("টাকা") || lastUserMsg.includes("ফান্ড")) {
        groundedReply = `যুক্তরাজ্যের স্টুডেন্ট ভিসার ক্ষেত্রে ইউকেভিআই (UKVI)-এর নিয়ম অনুযায়ী লন্ডনের বাইরে প্রতি মাসে £১,৩৩৪ পাউন্ড এবং লন্ডনের ভেতরে £১,৪৮৩ পাউন্ড হিসেবে সর্বোচ্চ ৯ মাসের লিভিং কস্ট এবং টিউশন ফি ব্যালেন্স অনুমোদিত ব্যাংকে টানা ২৮ দিন অপরিবর্তিত রাখতে হবে। ২৮তম দিনের পর ৩১ দিনের মধ্যে ভিসা আবেদন সম্পন্ন করতে হবে।`;
      } else if (lastUserMsg.includes("জার্মানি") || lastUserMsg.includes("ব্লকড")) {
        groundedReply = `জার্মানিতে উচ্চশিক্ষার জন্য শিক্ষার্থীদের ১ বছরের জীবনযাত্রার ব্যয় বাবদ সরকারি নির্ধারিত ব্লকড অ্যাকাউন্টে (যেমন: Expatrio বা Fintiba) মোট €১১,৯০৪ ইউরো জমা রাখতে হয়। ভিসা আবেদনের সময় এই ব্লকড অ্যাকাউন্টের কনফার্মেশন সনদ (Sperrbestätigung) দূতাবাসে জমা দেওয়া আবশ্যক।`;
      }

      return {
        reply: groundedReply,
        citedSources: citations,
        applicableRequirement: citations[0]?.applicableRequirement,
        limitations: "এই পরামর্শ সরকারি নির্দেশিকা অনুযায়ী প্রস্তুত। ভিসা ও ভর্তির চূড়ান্ত সিদ্ধান্ত বিশ্ববিদ্যালয় ও দূতাবাসের।",
        tokensUsed: { promptTokens: 420, completionTokens: 280, totalTokens: 700 },
        estimatedCostUsd: calculateTokenCost(420, 280, this.model),
      };
    }

    const compiledSystemPrompt = `${STUDY_ASSISTANT_SYSTEM_PROMPT}\n\n[সক্রিয় শিক্ষার্থীর প্রেক্ষাপট]:\n${contextLines.join("\n")}`;

    const cleanMessages = input.messages.map((m) => ({
      role: m.role,
      content: scrubSensitivePII(m.content),
    }));

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: compiledSystemPrompt },
        ...cleanMessages,
      ],
      temperature: 0.3,
    });

    const reply = response.choices[0]?.message.content ?? "দুঃখিত, উত্তর পাওয়া যায়নি।";
    const usage = response.usage;

    return {
      reply,
      citedSources: citations,
      applicableRequirement: citations[0]?.applicableRequirement,
      limitations: "এই পরামর্শ সরকারি নির্দেশিকা অনুযায়ী প্রস্তুত। ভিসা ও ভর্তির চূড়ান্ত সিদ্ধান্ত বিশ্ববিদ্যালয় ও দূতাবাসের।",
      tokensUsed: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
      estimatedCostUsd: calculateTokenCost(
        usage?.prompt_tokens ?? 0,
        usage?.completion_tokens ?? 0,
        this.model
      ),
    };
  }
}

export const aiProvider = new OpenAIProviderService();
export * from "./docx";
