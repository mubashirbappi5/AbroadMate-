import { describe, it, expect } from "vitest";
import {
  sopGenerateSchema,
  sopSectionEditSchema,
  sopTonePolishSchema,
  sopCritiqueSchema,
  aiChatSchema,
} from "../ai.schema";

describe("AI Validation Schemas", () => {
  it("validates SOP generate input", () => {
    const valid = sopGenerateSchema.safeParse({
      targetCountry: "GB",
      targetUniversity: "University of Edinburgh",
      targetProgram: "MSc Data Science",
      degreeLevel: "MASTER",
      careerGoals: "বাংলাদেশে টেক সেক্টরে ডাটা সায়েন্টিস্ট হিসেবে কাজ করা।",
      genuineMotivation: "উন্নত অ্যালগরিদম শেখার মাধ্যমে বাস্তব সমস্যার সমাধান।",
    });

    expect(valid.success).toBe(true);
  });

  it("validates section edit input", () => {
    const valid = sopSectionEditSchema.safeParse({
      sectionKey: "whyThisUniversity",
      currentContent: "I like Edinburgh.",
      userInstruction: "অধ্যাপকদের গবেষণা ল্যাব এবং লাইব্রেরির সুবিধা যুক্ত করুন।",
      context: {
        targetUniversity: "University of Edinburgh",
        targetProgram: "MSc AI",
      },
    });

    expect(valid.success).toBe(true);
  });

  it("validates AI chat message schema", () => {
    const valid = aiChatSchema.safeParse({
      messages: [{ role: "user", content: "ইউকে ভিসার খরচ কত?" }],
    });

    expect(valid.success).toBe(true);
  });
});
