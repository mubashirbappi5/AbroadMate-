import { z } from "zod";

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const documentUploadSchema = z.object({
  fileName: z.string().min(1, "ফাইলের নাম আবশ্যক").max(255),
  fileSize: z
    .number()
    .positive("ফাইলের সাইজ শূন্যের চেয়ে বেশি হতে হবে")
    .max(MAX_FILE_SIZE_BYTES, "ফাইলের সাইজ সর্বোচ্চ ১০ মেগাবাইট (10MB) হতে পারবে"),
  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    errorMap: () => ({ message: "শুধুমাত্র PDF, JPG, PNG বা DOCX ফাইল আপলোড করা যাবে" }),
  }),
  category: z.enum([
    "ACADEMIC_TRANSCRIPT",
    "DEGREE_CERTIFICATE",
    "LANGUAGE_TEST_TRF",
    "BANK_SOLVENCY",
    "BANK_STATEMENT_28DAY",
    "SPONSOR_AFFIDAVIT",
    "PASSPORT_BIOPAGE",
    "NATIONAL_ID",
    "POLICE_CLEARANCE",
    "TUBERCULOSIS_TEST",
    "SOP_ESSAY",
    "RESUME_CV",
    "RECOMMENDATION_LETTER",
    "OFFER_LETTER",
    "CAS_OR_I20",
    "OTHER",
  ]),
});

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;

export const signedUrlRequestSchema = z.object({
  documentId: z.string().uuid("সঠিক ডকুমেন্ট আইডি প্রদান করুন"),
  expiresInSeconds: z.number().int().min(60).max(3600).default(900), // Default 15 minutes
});

export type SignedUrlRequestInput = z.infer<typeof signedUrlRequestSchema>;
