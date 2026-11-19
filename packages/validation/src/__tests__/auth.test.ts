import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  bangladeshPhoneRegex,
} from "../auth.schema";

describe("Authentication Validation Tests", () => {
  describe("Registration Schema", () => {
    it("should accept valid student registration data", () => {
      const validData = {
        fullName: "সাকিব আহমেদ",
        email: "sakib.student@gmail.com",
        phone: "01712345678",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
        targetIntakeSeason: "FALL" as const,
        targetIntakeYear: 2026,
        ethicalNonAgencyConsent: true,
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept +880 format for Bangladeshi phone", () => {
      expect(bangladeshPhoneRegex.test("+8801712345678")).toBe(true);
      expect(bangladeshPhoneRegex.test("01812345678")).toBe(true);
      expect(bangladeshPhoneRegex.test("01312345678")).toBe(true);
      expect(bangladeshPhoneRegex.test("123456")).toBe(false);
      expect(bangladeshPhoneRegex.test("+1234567890")).toBe(false);
    });

    it("should reject registration when password and confirmPassword do not match", () => {
      const invalidData = {
        fullName: "সাকিব আহমেদ",
        email: "sakib.student@gmail.com",
        phone: "01712345678",
        password: "SecurePassword123",
        confirmPassword: "DifferentPassword456",
        targetIntakeSeason: "FALL" as const,
        targetIntakeYear: 2026,
        ethicalNonAgencyConsent: true,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.confirmPassword).toBeDefined();
      }
    });

    it("should reject registration when ethical non-agency consent is false", () => {
      const invalidData = {
        fullName: "সাকিব আহমেদ",
        email: "sakib.student@gmail.com",
        password: "SecurePassword123",
        confirmPassword: "SecurePassword123",
        ethicalNonAgencyConsent: false,
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.ethicalNonAgencyConsent).toBeDefined();
      }
    });

    it("should reject weak passwords lacking numbers or uppercase letters", () => {
      const weakPasswordData = {
        fullName: "সাকিব আহমেদ",
        email: "sakib.student@gmail.com",
        password: "weakpassword",
        confirmPassword: "weakpassword",
        ethicalNonAgencyConsent: true,
      };

      const result = registerSchema.safeParse(weakPasswordData);
      expect(result.success).toBe(false);
    });
  });

  describe("Login Schema", () => {
    it("should accept valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "student@abroadmate.com",
        password: "MyPassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email format", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "MyPassword123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        email: "student@abroadmate.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Password Reset Schema", () => {
    it("should validate forgot password email", () => {
      expect(forgotPasswordSchema.safeParse({ email: "valid@email.com" }).success).toBe(true);
      expect(forgotPasswordSchema.safeParse({ email: "invalid-email" }).success).toBe(false);
    });

    it("should validate new password and confirmation", () => {
      const valid = resetPasswordSchema.safeParse({
        password: "NewPassword123",
        confirmPassword: "NewPassword123",
      });
      expect(valid.success).toBe(true);

      const mismatch = resetPasswordSchema.safeParse({
        password: "NewPassword123",
        confirmPassword: "MismatchPassword123",
      });
      expect(mismatch.success).toBe(false);
    });
  });
});
