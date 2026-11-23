import { Worker, Job } from "bullmq";
import { prisma } from "@abroadmate/database";
import { connection, allQueues } from "./queues";
import { registerCronSchedulers } from "./schedulers/cronScheduler";

// Import processors
import { processDeadlineRemindersJob } from "./processors/deadlineReminders";
import { processScheduledNotificationsJob } from "./processors/scheduledNotifications";
import { processSourceMonitoringJob } from "./processors/sourceMonitoring";
import { processPolicyChangeDetectionJob } from "./processors/policyChangeDetection";
import { processAIDocumentGenerationJob } from "./processors/aiDocumentGeneration";
import { processDocumentProcessingJob } from "./processors/documentProcessing";
import { processPeriodicDataVerificationJob } from "./processors/periodicVerification";
import { processEmailDeliveryJob } from "./processors/emailDelivery";

export * from "./queues";
export * from "./processors/deadlineReminders";
export * from "./processors/scheduledNotifications";
export * from "./processors/sourceMonitoring";
export * from "./processors/policyChangeDetection";
export * from "./processors/aiDocumentGeneration";
export * from "./processors/documentProcessing";
export * from "./processors/periodicVerification";
export * from "./processors/emailDelivery";
export * from "./services/emailService";
export * from "./services/telegramService";
export * from "./services/idempotencyService";

const workers: Worker[] = [];

/**
 * Handles failed jobs and records them into the Dead Letter Queue (FailedJobLog) in PostgreSQL
 */
async function handleDeadLetterLog(job: Job | undefined, err: Error, queueName: string) {
  if (!job) return;

  console.error(`💥 [DLQ / Failed Job] Queue: ${queueName} | Job: ${job.id} | Error:`, err.message);

  try {
    await prisma.failedJobLog.create({
      data: {
        queueName,
        jobId: String(job.id || "unknown"),
        jobName: job.name,
        payloadJson: JSON.stringify(job.data || {}),
        failedReason: `${err.name}: ${err.message}\n${err.stack || ""}`,
        attemptsMade: job.attemptsMade,
      },
    });
  } catch (logErr) {
    console.error("Failed to write to FailedJobLog:", logErr);
  }
}

export function startWorkers() {
  console.log("🚀 Starting AbroadMate Background Worker service...");

  connection
    .connect()
    .then(async () => {
      console.log("✅ Worker connected to Redis.");

      // Register Repeatable Cron Schedulers
      await registerCronSchedulers().catch((err) => {
        console.warn("⚠️ Error registering cron schedulers:", err.message);
      });

      // 1. Deadline Reminders Worker
      const wDeadline = new Worker(
        "deadline-reminders",
        async (job) => {
          console.log(`[Worker] Running deadline-reminders job: ${job.name}`);
          return await processDeadlineRemindersJob();
        },
        { connection, concurrency: 5 }
      );
      wDeadline.on("failed", (job, err) => handleDeadLetterLog(job, err, "deadline-reminders"));
      workers.push(wDeadline);

      // 2. Scheduled Notifications Worker
      const wScheduled = new Worker(
        "scheduled-notifications",
        async (job) => {
          console.log(`[Worker] Running scheduled-notifications job: ${job.name}`);
          return await processScheduledNotificationsJob(job.data);
        },
        { connection, concurrency: 5 }
      );
      wScheduled.on("failed", (job, err) => handleDeadLetterLog(job, err, "scheduled-notifications"));
      workers.push(wScheduled);

      // 3. Source Monitoring Worker
      const wSource = new Worker(
        "source-monitoring",
        async (job) => {
          console.log(`[Worker] Running source-monitoring job: ${job.name}`);
          return await processSourceMonitoringJob();
        },
        { connection, concurrency: 2 }
      );
      wSource.on("failed", (job, err) => handleDeadLetterLog(job, err, "source-monitoring"));
      workers.push(wSource);

      // 4. Policy Change Detection Worker
      const wPolicy = new Worker(
        "policy-change-detection",
        async (job) => {
          console.log(`[Worker] Running policy-change-detection job: ${job.name}`);
          return await processPolicyChangeDetectionJob(job.data);
        },
        { connection, concurrency: 3 }
      );
      wPolicy.on("failed", (job, err) => handleDeadLetterLog(job, err, "policy-change-detection"));
      workers.push(wPolicy);

      // 5. AI Document Generation Worker
      const wAI = new Worker(
        "ai-document-generation",
        async (job) => {
          console.log(`[Worker] Running ai-document-generation job: ${job.name}`);
          return await processAIDocumentGenerationJob(job.data);
        },
        { connection, concurrency: 3 }
      );
      wAI.on("failed", (job, err) => handleDeadLetterLog(job, err, "ai-document-generation"));
      workers.push(wAI);

      // 6. Document Processing Worker
      const wDoc = new Worker(
        "document-processing",
        async (job) => {
          console.log(`[Worker] Running document-processing job: ${job.name}`);
          return await processDocumentProcessingJob(job.data);
        },
        { connection, concurrency: 5 }
      );
      wDoc.on("failed", (job, err) => handleDeadLetterLog(job, err, "document-processing"));
      workers.push(wDoc);

      // 7. Periodic Data Verification Worker
      const wVerification = new Worker(
        "periodic-data-verification",
        async (job) => {
          console.log(`[Worker] Running periodic-data-verification job: ${job.name}`);
          return await processPeriodicDataVerificationJob();
        },
        { connection, concurrency: 1 }
      );
      wVerification.on("failed", (job, err) =>
        handleDeadLetterLog(job, err, "periodic-data-verification")
      );
      workers.push(wVerification);

      // 8. Email Delivery Worker
      const wEmail = new Worker(
        "email-delivery",
        async (job) => {
          console.log(`[Worker] Running email-delivery job: ${job.name}`);
          return await processEmailDeliveryJob(job.data);
        },
        { connection, concurrency: 10 }
      );
      wEmail.on("failed", (job, err) => handleDeadLetterLog(job, err, "email-delivery"));
      workers.push(wEmail);

      console.log(`✅ All 8 BullMQ worker processors active and listening.`);
    })
    .catch((err) => {
      console.warn("⚠️ Worker: Redis connection unavailable in local offline mode. Standby.", err.message);
    });
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log("Shutting down workers...");
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  process.exit(0);
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// If executed directly
if (require.main === module) {
  startWorkers();
}
