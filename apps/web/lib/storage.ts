import { createAdminClient } from "@/lib/supabase/admin";
import { prisma, DocumentCategory, AuditAction } from "@abroadmate/database";
import { documentUploadSchema } from "@abroadmate/validation";

export const CATEGORY_BUCKET_MAP: Record<DocumentCategory, string> = {
  ACADEMIC_TRANSCRIPT: "academic-documents",
  DEGREE_CERTIFICATE: "academic-documents",
  RECOMMENDATION_LETTER: "academic-documents",
  OFFER_LETTER: "academic-documents",
  CAS_OR_I20: "academic-documents",
  BANK_SOLVENCY: "financial-documents",
  BANK_STATEMENT_28DAY: "financial-documents",
  SPONSOR_AFFIDAVIT: "financial-documents",
  PASSPORT_BIOPAGE: "identity-documents",
  NATIONAL_ID: "identity-documents",
  POLICE_CLEARANCE: "identity-documents",
  LANGUAGE_TEST_TRF: "language-certificates",
  TUBERCULOSIS_TEST: "language-certificates",
  SOP_ESSAY: "sop-files",
  RESUME_CV: "sop-files",
  OTHER: "academic-documents",
};

/**
 * Uploads student document into user-isolated private bucket.
 * Records metadata in PostgreSQL UserDocument.
 */
export async function uploadStudentDocument(params: {
  userId: string;
  fileBuffer: Buffer;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: DocumentCategory;
}) {
  const { userId, fileBuffer, fileName, fileSize, mimeType, category } = params;

  // Validate file parameters with Zod
  const validation = documentUploadSchema.safeParse({
    fileName,
    fileSize,
    mimeType,
    category,
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0]?.message || "ফাইল ভ্যালিডেশন ব্যর্থ হয়েছে");
  }

  const bucketName = CATEGORY_BUCKET_MAP[category] || "academic-documents";
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const uniqueKey = `${userId}/${category.toLowerCase()}/${crypto.randomUUID()}-${sanitizedFileName}`;

  const supabase = createAdminClient();

  // Upload to Supabase Private Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(uniqueKey, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase storage upload error:", uploadError);
    throw new Error(`ফাইল স্টোরেজে আপলোড করতে ব্যর্থ হয়েছে: ${uploadError.message}`);
  }

  // Create database record in UserDocument
  const doc = await prisma.userDocument.create({
    data: {
      userId,
      bucketName,
      storagePath: uniqueKey,
      category,
      fileName,
      fileSize,
      mimeType,
      isVerified: false,
    },
  });

  // Audit log entry
  await prisma.auditLog.create({
    data: {
      userId,
      action: AuditAction.CREATE,
      resourceType: "DOCUMENT",
      resourceId: doc.id,
      changesJson: JSON.stringify({ fileName, category, bucketName, fileSize }),
    },
  });

  return doc;
}

/**
 * Generates a temporary time-limited signed URL for viewing private student documents.
 * Ensures the requesting user owns the document or has administrative permissions.
 */
export async function generateDocumentSignedUrl(params: {
  requestingUserId: string;
  documentId: string;
  isAdmin?: boolean;
  expiresInSeconds?: number;
}) {
  const { requestingUserId, documentId, isAdmin = false, expiresInSeconds = 900 } = params;

  const doc = await prisma.userDocument.findUnique({
    where: { id: documentId },
  });

  if (!doc || doc.deletedAt) {
    throw new Error("ডকুমেন্টটি খুঁজে পাওয়া যায়নি।");
  }

  // Enforce user data isolation: User can only access their own documents
  if (doc.userId !== requestingUserId && !isAdmin) {
    throw new Error("FORBIDDEN: এই ফাইলটি দেখার অনুমতি আপনার নেই।");
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(doc.bucketName)
    .createSignedUrl(doc.storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    console.error("Error creating signed URL:", error);
    throw new Error("ডকুমেন্টের সিকিউর লিঙ্ক তৈরি করা সম্ভব হয়নি।");
  }

  // Audit file access
  await prisma.auditLog.create({
    data: {
      userId: requestingUserId,
      action: AuditAction.DOWNLOAD,
      resourceType: "DOCUMENT",
      resourceId: doc.id,
      changesJson: JSON.stringify({ signedUrlGenerated: true, expiresAt: Date.now() + expiresInSeconds * 1000 }),
    },
  });

  return {
    signedUrl: data.signedUrl,
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    expiresInSeconds,
  };
}
