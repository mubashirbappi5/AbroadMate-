import { describe, it, expect } from "vitest";
import { evaluateQuickEligibility } from "../../packages/eligibility-engine/src";

describe("Eligibility Engine", () => {
  it("should evaluate an eligible postgraduate candidate with GPA 3.5 and IELTS 7.0 for UK", () => {
    const result = evaluateQuickEligibility({
      targetCountry: "GB",
      degreeLevel: "master",
      currentGpa: 3.5,
      ieltsBand: 7.0,
    });

    expect(result.status).toBe("ELIGIBLE");
    expect(result.scorePercentage).toBeGreaterThanOrEqual(80);
    expect(result.reasonsBn.length).toBeGreaterThan(0);
  });

  it("should flag borderline candidate with lower IELTS score", () => {
    const result = evaluateQuickEligibility({
      targetCountry: "DE",
      degreeLevel: "master",
      currentGpa: 3.2,
      ieltsBand: 6.0,
    });

    expect(result.status).toBe("BORDERLINE");
    expect(result.recommendationsBn.length).toBeGreaterThan(0);
  });
});
