import { z } from "zod";

export const sopGenerateSchema = z.object({
  targetCountry: z.string().min(2, "কাঙ্ক্ষিত দেশের নাম প্রয়োজন"),
  targetUniversity: z.string().min(2, "বিশ্ববিদ্যালয়ের নাম প্রয়োজন"),
  targetProgram: z.string().min(2, "কোর্সের নাম প্রয়োজন"),
  degreeLevel: z.enum(["BACHELOR", "MASTER", "DOCTORATE"]).default("MASTER"),
  academicHistory: z.array(
    z.object({
      degree: z.string().min(1),
      institution: z.string().min(1),
      cgpa: z.number().nullable().optional(),
      graduationYear: z.number().nullable().optional(),
    })
  ).default([]),
  workExperience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      durationMonths: z.number().nullable().optional(),
      highlights: z.string().nullable().optional(),
    })
  ).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  careerGoals: z.string().min(3, "ক্যারিয়ার লক্ষ্য উল্লেখ করুন"),
  genuineMotivation: z.string().min(3, "পড়ার মূল উদ্দেশ্য ও আগ্রহের কারণ উল্লেখ করুন"),
  personalExperiences: z.string().optional(),
  tone: z.enum(["ACADEMIC", "PROFESSIONAL", "PERSUASIVE"]).default("ACADEMIC"),
});

export type SopGenerateInput = z.infer<typeof sopGenerateSchema>;

export const sopSectionEditSchema = z.object({
  sectionKey: z.enum([
    "introductionMotivation",
    "academicBackground",
    "workResearchExperience",
    "whyThisUniversity",
    "careerGoalsContribution",
  ]),
  currentContent: z.string(),
  userInstruction: z.string().min(3, "সম্পাদনার নির্দেশনা প্রদান করুন"),
  context: z.object({
    targetUniversity: z.string(),
    targetProgram: z.string(),
    targetCountry: z.string().optional(),
  }),
});

export type SopSectionEditInput = z.infer<typeof sopSectionEditSchema>;

export const sopTonePolishSchema = z.object({
  fullContent: z.string().min(30, "পরিমার্জন করার মতো পর্যাপ্ত টেক্সট প্রদান করুন"),
  targetTone: z.enum(["ACADEMIC", "PROFESSIONAL", "PERSUASIVE"]),
});

export type SopTonePolishInput = z.infer<typeof sopTonePolishSchema>;

export const sopCritiqueSchema = z.object({
  fullContent: z.string().min(50, "রিভিউ করার জন্য অন্তত ৫০ শব্দের খসড়া প্রদান করুন"),
  targetUniversity: z.string().min(2),
  targetProgram: z.string().min(2),
});

export type SopCritiqueInput = z.infer<typeof sopCritiqueSchema>;

export const aiChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1, "বার্তা খালি হতে পারে না"),
    })
  ).min(1, "অন্তত একটি মেসেজ পাঠাতে হবে"),
  conversationId: z.string().uuid().optional(),
});

export type AIChatInput = z.infer<typeof aiChatSchema>;
