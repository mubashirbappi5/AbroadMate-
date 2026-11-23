import { Queue, QueueOptions } from "bullmq";
import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST ?? "localhost";
const redisPort = Number(process.env.REDIS_PORT ?? 6379);

export const connection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableOfflineQueue: false,
});

export const defaultJobOptions = {
  attempts: 5,
  backoff: {
    type: "exponential",
    delay: 2000,
  },
  removeOnComplete: {
    age: 24 * 3600,
    count: 1000,
  },
  removeOnFail: {
    age: 7 * 24 * 3600,
  },
};

const queueOpts: QueueOptions = {
  connection,
  defaultJobOptions,
};

// 1. Deadline Reminders Queue
export const deadlineReminderQueue = new Queue("deadline-reminders", queueOpts);

// 2. Scheduled Notifications Queue
export const scheduledNotificationQueue = new Queue("scheduled-notifications", queueOpts);

// 3. Source Monitoring Queue
export const sourceMonitoringQueue = new Queue("source-monitoring", queueOpts);

// 4. Policy Change Detection Queue
export const policyChangeDetectionQueue = new Queue("policy-change-detection", queueOpts);

// 5. AI Document Generation Queue
export const aiDocumentGenerationQueue = new Queue("ai-document-generation", queueOpts);

// 6. Document Processing Queue
export const documentProcessingQueue = new Queue("document-processing", queueOpts);

// 7. Periodic Data Verification Queue
export const periodicDataVerificationQueue = new Queue("periodic-data-verification", queueOpts);

// 8. Email Delivery Queue
export const emailDeliveryQueue = new Queue("email-delivery", queueOpts);

export const allQueues = [
  deadlineReminderQueue,
  scheduledNotificationQueue,
  sourceMonitoringQueue,
  policyChangeDetectionQueue,
  aiDocumentGenerationQueue,
  documentProcessingQueue,
  periodicDataVerificationQueue,
  emailDeliveryQueue,
];
