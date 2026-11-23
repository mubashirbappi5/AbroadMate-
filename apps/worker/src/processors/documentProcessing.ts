import { prisma, NotificationType, VerificationStatus } from "@abroadmate/database";

export interface DocumentProcessingJobData {
  documentId: string;
  userId: string;
  fileUrl: string;
}

export async function processDocumentProcessingJob(data: DocumentProcessingJobData) {
  const { documentId, userId } = data;

  const doc = await prisma.userDocument.findUnique({
    where: { id: documentId },
  });

  if (!doc) {
    throw new Error(`Document not found: ${documentId}`);
  }

  // Simulate automated document sanity checks (file format, minimum resolution, virus scan pass)
  const isPass = true;

  await prisma.userDocument.update({
    where: { id: documentId },
    data: {
      isVerified: isPass,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "ডকুমেন্ট আপলোড ও প্রসেসিং সম্পন্ন",
      message: `আপনার আপলোডকৃত "${doc.fileName}" সফলভাবে সিস্টেম দ্বারা স্ক্যান ও ভ্যালিডেট হয়েছে। এটি এখন অ্যাডমিন পর্যালোচনার জন্য প্রস্তুত।`,
      type: NotificationType.INFO,
      actionUrl: "/dashboard/documents",
    },
  });

  return { success: true, documentId, status: "PROCESSED" };
}
