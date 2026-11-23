import { prisma, NotificationType } from "@abroadmate/database";
import { EmailService } from "../services/emailService";

export interface AIDocumentGenerationJobData {
  documentId: string;
  userId: string;
  promptTopic: string;
}

export async function processAIDocumentGenerationJob(data: AIDocumentGenerationJobData) {
  const { documentId, userId, promptTopic } = data;

  const doc = await prisma.sOPDocument.findUnique({
    where: { id: documentId },
    include: {
      user: {
        include: { settings: true },
      },
    },
  });

  if (!doc) {
    throw new Error(`SOP Document not found: ${documentId}`);
  }

  // Simulate or execute generation completion
  const titleBn = `SOP ও স্টেটমেন্ট অফ পারপাস প্রস্তুত!`;
  const messageBn = `আপনার "${doc.title}"-এর খসড়া এআই সহকারী দ্বারা সফলভাবে প্রস্তুত করা হয়েছে। পোর্টালে গিয়ে সেকশন-ভিত্তিক এডিট এবং DOCX/PDF ডাউনলোড করতে পারেন।`;

  await prisma.notification.create({
    data: {
      userId,
      title: titleBn,
      message: messageBn,
      type: NotificationType.INFO,
      actionUrl: "/dashboard/sop-builder",
    },
  });

  if (doc.user?.email) {
    await EmailService.sendEmail({
      to: doc.user.email,
      subject: `[AbroadMate] ${titleBn}`,
      title: titleBn,
      messageBn,
      category: "SOP_READY",
      actionUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://abroadmate.ai"}/dashboard/sop-builder`,
    });
  }

  return { success: true, documentId };
}
