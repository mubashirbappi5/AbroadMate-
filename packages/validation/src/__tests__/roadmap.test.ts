import { describe, it, expect } from "vitest";
import {
  generateRoadmapSchema,
  updateRoadmapTaskSchema,
  recalculateRoadmapSchema,
  createDeadlineSchema,
} from "../roadmap.schema";

describe("Roadmap Validation Schemas", () => {
  it("validates generate roadmap input with defaults", () => {
    const parsed = generateRoadmapSchema.parse({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
    });

    expect(parsed.targetCountryCode).toBe("GB");
    expect(parsed.fundingChoice).toBe("SELF_FUNDED");
    expect(parsed.degreeLevel).toBe("MASTER");
  });

  it("validates task status updates", () => {
    const valid = updateRoadmapTaskSchema.safeParse({
      status: "COMPLETED",
      isCompleted: true,
    });
    expect(valid.success).toBe(true);

    const invalid = updateRoadmapTaskSchema.safeParse({
      status: "INVALID_STATUS",
    });
    expect(invalid.success).toBe(false);
  });

  it("validates recalculate roadmap schema", () => {
    const valid = recalculateRoadmapSchema.safeParse({
      newCountryCode: "DE",
      newIntakeSeason: "spring",
      newIntakeYear: 2027,
      changeReasonBn: "জার্মানিতে টিউশন ফ্রি মাস্টার্সের জন্য দেশ পরিবর্তন",
    });

    expect(valid.success).toBe(true);
  });

  it("validates deadline creation with valid date", () => {
    const valid = createDeadlineSchema.safeParse({
      titleBn: "শেভেনিং স্কলারশিপ ডেডলাইন",
      titleEn: "Chevening Scholarship Deadline",
      deadlineType: "SCHOLARSHIP_DEADLINE",
      category: "SCHOLARSHIP",
      deadlineDate: "2026-11-05",
      officialUrl: "https://www.chevening.org",
    });

    expect(valid.success).toBe(true);
  });
});
