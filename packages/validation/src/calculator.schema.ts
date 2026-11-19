import { z } from "zod";

export const ExpenseCalculationInputSchema = z.object({
  countryCode: z.enum(["GB", "CA", "AU", "DE", "US"]),
  degreeLevel: z.enum(["bachelor", "master", "phd"]),
  tuitionFeeLocal: z.number().min(0),
  cityType: z.enum(["METRO", "REGIONAL", "AFFORDABLE"]).default("REGIONAL"),
  includeHealthInsurance: z.boolean().default(true),
  includeVisaFee: z.boolean().default(true),
  includeAirfare: z.boolean().default(true),
});

export type ExpenseCalculationInput = z.infer<typeof ExpenseCalculationInputSchema>;
