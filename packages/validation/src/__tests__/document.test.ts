import { describe, it, expect } from "vitest";
import {
  documentUploadSchema,
  signedUrlRequestSchema,
  MAX_FILE_SIZE_BYTES,
} from "../document.schema";

describe("Document Upload & Storage Security Tests", () => {
  it("should accept valid PDF upload below 10MB limit", () => {
    const validDoc = {
      fileName: "bachelor_transcript.pdf",
      fileSize: 2.5 * 1024 * 1024, // 2.5MB
      mimeType: "application/pdf" as const,
      category: "ACADEMIC_TRANSCRIPT" as const,
    };

    const result = documentUploadSchema.safeParse(validDoc);
    expect(result.success).toBe(true);
  });

  it("should accept valid image format (PNG/JPEG) for passport and NID", () => {
    const validPassport = {
      fileName: "passport_bio.jpg",
      fileSize: 1.2 * 1024 * 1024,
      mimeType: "image/jpeg" as const,
      category: "PASSPORT_BIOPAGE" as const,
    };

    const result = documentUploadSchema.safeParse(validPassport);
    expect(result.success).toBe(true);
  });

  it("should reject files exceeding 10MB size limit", () => {
    const oversizedDoc = {
      fileName: "huge_video.pdf",
      fileSize: MAX_FILE_SIZE_BYTES + 1024, // >10MB
      mimeType: "application/pdf" as const,
      category: "ACADEMIC_TRANSCRIPT" as const,
    };

    const result = documentUploadSchema.safeParse(oversizedDoc);
    expect(result.success).toBe(false);
  });

  it("should reject executable and dangerous file types", () => {
    const dangerousFile = {
      fileName: "malware.exe",
      fileSize: 1024,
      mimeType: "application/x-msdownload" as any,
      category: "OTHER" as const,
    };

    const result = documentUploadSchema.safeParse(dangerousFile);
    expect(result.success).toBe(false);
  });

  it("should validate signed URL generation request with valid UUID", () => {
    const validRequest = {
      documentId: "123e4567-e89b-12d3-a456-426614174000",
      expiresInSeconds: 900,
    };

    const result = signedUrlRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("should reject invalid non-UUID documentId for signed URL", () => {
    const invalidRequest = {
      documentId: "not-a-uuid",
      expiresInSeconds: 900,
    };

    const result = signedUrlRequestSchema.safeParse(invalidRequest);
    expect(result.success).toBe(false);
  });
});
