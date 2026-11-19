import { z } from "zod";

// Bangladeshi phone regex: +8801XXXXXXXXX or 01XXXXXXXXX
export const bangladeshPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "পূর্ণ নাম কমপক্ষে ২ অক্ষরের হতে হবে")
      .max(100, "নাম সর্বোচ্চ ১০০ অক্ষরের মধ্যে হতে হবে"),
    email: z
      .string()
      .email("সঠিক ইমেইল এড্রেস প্রদান করুন")
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .regex(bangladeshPhoneRegex, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678 বা +8801712345678)")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
      .regex(/[A-Z]/, "কমপক্ষে একটি বড় হাতের অক্ষর (A-Z) থাকতে হবে")
      .regex(/[0-9]/, "কমপক্ষে একটি সংখ্যা (0-9) থাকতে হবে"),
    confirmPassword: z.string(),
    targetIntakeSeason: z.enum(["FALL", "SPRING", "SUMMER"]).default("FALL"),
    targetIntakeYear: z.number().int().min(2025).max(2030).default(2026),
    ethicalNonAgencyConsent: z
      .boolean()
      .refine((val) => val === true, "আপনাকে আমাদের ফ্রি ও নৈতিক শিক্ষার্থী শর্তাবলী স্বীকার করতে হবে"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("সঠিক ইমেইল এড্রেস লিখুন")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "পাসওয়ার্ড আবশ্যক"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("সঠিক ইমেইল এড্রেস লিখুন")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
      .regex(/[A-Z]/, "কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে")
      .regex(/[0-9]/, "কমপক্ষে একটি সংখ্যা থাকতে হবে"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "বর্তমান পাসওয়ার্ড দিন"),
    newPassword: z
      .string()
      .min(8, "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
      .regex(/[A-Z]/, "কমপক্ষে একটি বড় হাতের অক্ষর থাকতে হবে")
      .regex(/[0-9]/, "কমপক্ষে একটি সংখ্যা থাকতে হবে"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
