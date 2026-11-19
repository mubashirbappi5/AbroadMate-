import { z } from "zod";

export const QuickEligibilityCheckSchema = z.object({
  targetCountry: z.string().min(2, "দেশ নির্বাচন করুন"),
  degreeLevel: z.enum(["bachelor", "master", "phd"]),
  currentGpa: z.number().min(2.0).max(5.0, "সঠিক জিপিএ / সিজিপিএ দিন"),
  ieltsBand: z.number().min(0.0).max(9.0, "সঠিক আইইএলটিএস ব্যান্ড দিন"),
  fieldOfStudy: z.string().optional(),
});

export type QuickEligibilityCheckInput = z.infer<typeof QuickEligibilityCheckSchema>;
