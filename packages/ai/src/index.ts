import OpenAI from "openai";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponseWithCitations {
  reply: string;
  citedSources: string[];
}

export const ABROADMATE_SYSTEM_PROMPT = `
আপনি হলেন AbroadMate-এর প্রধান এআই শিক্ষা উপদেষ্টা (AI Study Abroad Advisor)।
আপনার দায়িত্ব হলো বাংলাদেশের শিক্ষার্থীদের উচ্চশিক্ষা ও স্টুডেন্ট ভিসা সংক্রান্ত প্রশ্নের সৎ, ভেরিফাইড এবং নির্ভুল উত্তর দেওয়া।

মূল নীতিমালা:
১. সম্পূর্ণ বিনামূল্যে ও এজেন্সিমুক্ত মানসিকতায় পরামর্শ দেবেন। কখনোই কোনো বাণিজ্যিক এজেন্সি বা দালালির মতো মিথ্যা আশ্বাস (যেমন: "১০০% ভিসা গ্যারান্টি", "কোনো খরচ ছাড়াই ভিসা") দেবেন না।
২. স্পষ্ট ভাষায় বাংলায় উত্তর প্রদান করুন। যেখানে ইংরেজি পরিভাষা (যেমন: CAS, I-20, Blocked Account, Post-study Work) থাকবে, সেখানে সহজ বাংলা ব্যাখ্যা সংযুক্ত করুন।
৩. টাকার পরিমাণ উল্লেখ করার সময় সংশ্লিষ্ট দেশের মুদ্রা এবং সমসাময়িক আনুমানিক বাংলাদেশি টাকায় (BDT) হিসাব দিন।
৪. উত্তর দেওয়ার সময় অফিসিয়াল সরকারি বা দূতাবাস পোর্টালের রেফারেন্স দিন। কোনো নিয়ম নিশ্চিত না জানা থাকলে স্পষ্টভাবে বলুন: "এই তথ্যটি নিশ্চিত নয়, দয়া করে সংশ্লিষ্ট দূতাবাসের অফিসিয়াল সাইট থেকে যাচাই করে নিন।"
`;

export class AIProviderService {
  private client: OpenAI | null = null;
  private model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.OPENAI_MODEL ?? "gpt-4o";

    if (apiKey && !apiKey.startsWith("sk-local-dev") && apiKey.length > 10) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async generateChatResponse(
    messages: ChatMessage[],
    verifiedSourcesContext?: string
  ): Promise<AIResponseWithCitations> {
    if (!this.client) {
      // Graceful local development fallback
      return {
        reply: "AbroadMate এআই উপদেষ্টায় স্বাগতম! আপনি উচ্চশিক্ষা, ভিসা প্রস্তুতি, বা খরচ সম্পর্কে প্রশ্ন করতে পারেন। (সিস্টেম বর্তমানে ডেভেলপমেন্ট মোডে চলছে। সক্রিয় OpenAI API Key প্রদান করলে স্বয়ংক্রিয় লাইভ উত্তর কার্যকর হবে।)",
        citedSources: [
          "https://www.gov.uk/student-visa",
          "https://www.make-it-in-germany.com",
        ],
      };
    }

    const systemPromptWithContext = verifiedSourcesContext
      ? `${ABROADMATE_SYSTEM_PROMPT}\n\n[অফিসিয়াল ডাটাবেজ তথ্যসূত্রসমূহ]:\n${verifiedSourcesContext}`
      : ABROADMATE_SYSTEM_PROMPT;

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: systemPromptWithContext },
        ...messages,
      ],
      temperature: 0.3, // Lower temperature to minimize hallucination
    });

    return {
      reply: response.choices[0]?.message.content ?? "কোনো উত্তর পাওয়া যায়নি।",
      citedSources: [],
    };
  }

  async generateSopOutline(
    degree: string,
    major: string,
    targetCountry: string,
    academicBackground: string,
    careerGoals: string
  ): Promise<string> {
    const prompt = `
ছাত্র/ছাত্রীর তথ্যাবলী:
- কাঙ্ক্ষিত ডিগ্রি: ${degree}
- বিষয়: ${major}
- পছন্দের দেশ: ${targetCountry}
- বর্তমান একাডেমিক ব্যাকগ্রাউন্ড: ${academicBackground}
- ক্যারিয়ার লক্ষ্য: ${careerGoals}

উপরের তথ্যের ওপর ভিত্তি করে একটি আন্তর্জাতিক মানের Statement of Purpose (SOP) এর কাঠামো ও প্যারাগ্রাফভিত্তিক দিকনির্দেশনা (Outline) বাংলায় এবং ইংরেজিতে প্রস্তুত করে দিন।
`;

    if (!this.client) {
      return `[নমুনা এসওপি কাঠামো]\n1. ভূমিকা ও বিষয় নির্বাচন (Introduction & Motivation)\n2. পূর্ববর্তী একাডেমিক ভিত্তি (Academic Foundation)\n3. কেন এই দেশ ও কেন এই বিশ্ববিদ্যালয় (Why this Country & University)\n4. ভবিষ্যৎ ক্যারিয়ার পরিকল্পনা ও বাংলাদেশে অবদান (Future Career Goals)`;
    }

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: ABROADMATE_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    return response.choices[0]?.message.content ?? "";
  }
}

export const aiProvider = new AIProviderService();
