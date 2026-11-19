import { describe, it, expect } from "vitest";
import { calculateVisaFinancialProof } from "../../packages/visa-engine/src";

describe("Visa Engine", () => {
  it("should calculate correct German Blocked Account requirement (€11,904)", () => {
    const result = calculateVisaFinancialProof("DE", 0);
    expect(result.livingFundsRequiredLocal).toBe(11904);
    expect(result.currencyCode).toBe("EUR");
    expect(result.totalBdtApprox).toBeGreaterThan(1500000);
    expect(result.holdingRuleNoticeBn).toContain("১১,৯০৪ ইউরো");
  });

  it("should enforce UK 28-day rule for tuition and 9-month living funds", () => {
    const tuition = 16000;
    const result = calculateVisaFinancialProof("GB", tuition, false);
    expect(result.tuitionFeeLocal).toBe(16000);
    expect(result.livingFundsRequiredLocal).toBe(1023 * 9);
    expect(result.holdingRuleNoticeBn).toContain("টানা ২৮ দিন");
  });
});
