import { describe, it, expect } from "vitest";
import {
  generateIntelligentRoadmap,
  evaluateTaskDependencies,
  mergeRoadmapTasksWithPreservation,
  flagTasksForPolicyReview,
  calculateDeadlineAlerts,
  calculateIntakeDate,
} from "../index";

describe("Roadmap Engine Core", () => {
  it("generates all 12 lifecycle phases when scholarship is selected", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SCHOLARSHIP_FUNDED",
      hasValidPassport: false,
    });

    expect(roadmap.length).toBe(12);
    const keys = roadmap.map((p) => p.phaseKey);
    expect(keys).toEqual([
      "PREPARATION",
      "ACADEMIC_PREPARATION",
      "LANGUAGE_PREPARATION",
      "UNIVERSITY_APPLICATION",
      "SCHOLARSHIP_APPLICATION",
      "ADMISSION_CONFIRMATION",
      "FINANCIAL_PREPARATION",
      "STUDENT_VISA_APPLICATION",
      "BIOMETRICS_AND_MEDICAL",
      "VISA_DECISION",
      "PRE_DEPARTURE",
      "ARRIVAL_AND_ENROLLMENT",
    ]);
  });

  it("omits Phase 5 (Scholarship Application) when fundingChoice is SELF_FUNDED", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    expect(roadmap.length).toBe(11);
    const phaseKeys = roadmap.map((p) => p.phaseKey);
    expect(phaseKeys).not.toContain("SCHOLARSHIP_APPLICATION");
    expect(phaseKeys).toContain("FINANCIAL_PREPARATION");
  });

  it("injects Germany-specific requirements: APS certificate & Blocked Account", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "DE",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    const allTasks = roadmap.flatMap((p) => p.tasks);
    const apsTask = allTasks.find((t) => t.taskCode === "TASK_GER_APS_CERTIFICATE");
    const blockedAccTask = allTasks.find((t) => t.taskCode === "TASK_BANK_FUNDS_MAINTENANCE");

    expect(apsTask).toBeDefined();
    expect(apsTask?.titleBn).toContain("এপিএস (APS)");
    expect(blockedAccTask?.titleBn).toContain("১১,৯০৪ ইউরো");
  });

  it("injects UK-specific requirements: CAS and 28-day bank fund rule", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    const allTasks = roadmap.flatMap((p) => p.tasks);
    const casTask = allTasks.find((t) => t.taskCode === "TASK_UK_CAS_RECEIVE");
    const ukBankTask = allTasks.find((t) => t.taskCode === "TASK_BANK_FUNDS_MAINTENANCE");

    expect(casTask).toBeDefined();
    expect(casTask?.titleBn).toContain("CAS");
    expect(ukBankTask?.titleBn).toContain("২৮-দিনের");
  });

  it("correctly evaluates DAG dependencies and sets BLOCKED statuses", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
      hasValidPassport: false,
    });

    const allTasks = roadmap.flatMap((p) => p.tasks);

    // Initial passport task has no dependencies -> NOT_STARTED
    const passportTask = allTasks.find((t) => t.taskCode === "TASK_PASSPORT_CHECK");
    expect(passportTask?.status).toBe("NOT_STARTED");

    // Flight booking depends on passport collection -> should be BLOCKED initially
    const flightTask = allTasks.find((t) => t.taskCode === "TASK_FLIGHT_BOOKING");
    expect(flightTask?.status).toBe("BLOCKED");
  });

  it("unblocks dependent tasks when prerequisite tasks are marked completed", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    // Mark passport collection as completed
    const modifiedPhases = roadmap.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((task) => {
        if (task.taskCode === "TASK_PASSPORT_COLLECTION") {
          return { ...task, status: "COMPLETED" as const, isCompleted: true };
        }
        return task;
      }),
    }));

    const evaluated = evaluateTaskDependencies(modifiedPhases);
    const flightTask = evaluated.flatMap((p) => p.tasks).find((t) => t.taskCode === "TASK_FLIGHT_BOOKING");

    // Once TASK_PASSPORT_COLLECTION is completed, flight booking should be unblocked
    expect(flightTask?.status).toBe("NOT_STARTED");
  });

  it("preserves completed milestones when recalculating across country change (UK to Germany)", () => {
    // Student started with UK and completed passport and IELTS
    const ukRoadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    // Mark passport and IELTS as completed
    const completedTimestamp = "2026-05-10T10:00:00.000Z";
    const ukWithCompleted = ukRoadmap.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((t) => {
        if (t.taskCode === "TASK_PASSPORT_CHECK" || t.taskCode === "TASK_IELTS_EXAM") {
          return {
            ...t,
            status: "COMPLETED" as const,
            isCompleted: true,
            completedAt: completedTimestamp,
          };
        }
        return t;
      }),
    }));

    // Student now changes country to Germany
    const germanyBlueprint = generateIntelligentRoadmap({
      targetCountryCode: "DE",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    const { mergedPhases, preservedCount } = mergeRoadmapTasksWithPreservation(
      ukWithCompleted,
      germanyBlueprint,
      "কাঙ্ক্ষিত দেশ যুক্তরাজ্য থেকে জার্মানি পরিবর্তন করা হয়েছে"
    );

    expect(preservedCount).toBeGreaterThanOrEqual(2);

    const mergedTasks = mergedPhases.flatMap((p) => p.tasks);
    const preservedPassport = mergedTasks.find((t) => t.taskCode === "TASK_PASSPORT_CHECK");
    const preservedIelts = mergedTasks.find((t) => t.taskCode === "TASK_IELTS_EXAM");
    const newAps = mergedTasks.find((t) => t.taskCode === "TASK_GER_APS_CERTIFICATE");

    expect(preservedPassport?.status).toBe("COMPLETED");
    expect(preservedPassport?.completedAt).toBe(completedTimestamp);
    expect(preservedIelts?.status).toBe("COMPLETED");

    // The new Germany-specific task exists and is not overwritten
    expect(newAps).toBeDefined();
    expect(newAps?.status).not.toBe("COMPLETED");
  });

  it("flags affected tasks with needsReview on policy updates", () => {
    const roadmap = generateIntelligentRoadmap({
      targetCountryCode: "GB",
      targetIntakeSeason: "fall",
      targetIntakeYear: 2026,
      fundingChoice: "SELF_FUNDED",
    });

    const flagged = flagTasksForPolicyReview(roadmap, ["TASK_BANK_FUNDS_MAINTENANCE"]);
    const bankTask = flagged.flatMap((p) => p.tasks).find((t) => t.taskCode === "TASK_BANK_FUNDS_MAINTENANCE");

    expect(bankTask?.needsReview).toBe(true);
  });

  it("calculates 30, 14, 7, 3, and 1 day deadline notifications accurately", () => {
    const fakeToday = new Date("2026-10-01T00:00:00.000Z");

    const deadlines = [
      { id: "dl-30", titleBn: "শেভেনিং স্কলারশিপ", deadlineDate: "2026-10-31T00:00:00.000Z" }, // 30 days
      { id: "dl-14", titleBn: "আইইএলটিএস পরীক্ষা", deadlineDate: "2026-10-15T00:00:00.000Z" }, // 14 days
      { id: "dl-7", titleBn: "টিউশন ফি ডিপোজিট", deadlineDate: "2026-10-08T00:00:00.000Z" }, // 7 days
      { id: "dl-3", titleBn: "ভিসা অনলাইন সাবমিশন", deadlineDate: "2026-10-04T00:00:00.000Z" }, // 3 days
      { id: "dl-1", titleBn: "ভিএফএস বায়োমেট্রিক অ্যাপয়েন্টমেন্ট", deadlineDate: "2026-10-02T00:00:00.000Z" }, // 1 day
      { id: "dl-20", titleBn: "অন্যান্য ডেডলাইন", deadlineDate: "2026-10-21T00:00:00.000Z" }, // 20 days (no trigger)
    ];

    const alerts = calculateDeadlineAlerts(deadlines, fakeToday);

    expect(alerts.length).toBe(5);
    const intervals = alerts.map((a) => a.alertIntervalDay).sort((a, b) => a - b);
    expect(intervals).toEqual([1, 3, 7, 14, 30]);

    const alert1 = alerts.find((a) => a.alertIntervalDay === 1);
    expect(alert1?.urgency).toBe("CRITICAL");
    expect(alert1?.messageBn).toContain("আগামীকাল");
  });
});
