import { Worker, Queue } from "bullmq";
import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST ?? "localhost";
const redisPort = Number(process.env.REDIS_PORT ?? 6379);

console.log(`🚀 AbroadMate Background Worker initializing on Redis ${redisHost}:${redisPort}...`);

// Connection options with reconnect handling
const connection = new Redis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
  lazyConnect: true,
});

export const DEADLINE_REMINDER_QUEUE = "deadline-reminders";
export const deadlineQueue = new Queue(DEADLINE_REMINDER_QUEUE, { connection });

export function startWorker() {
  connection
    .connect()
    .then(() => {
      console.log("✅ Worker connected to Redis.");

      const worker = new Worker(
        DEADLINE_REMINDER_QUEUE,
        async (job) => {
          console.log(`[Worker Job] Processing reminder for student:`, job.data);
          // In full implementation: trigger email or notification
          return { status: "PROCESSED", timestamp: new Date().toISOString() };
        },
        { connection }
      );

      worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed successfully.`);
      });

      worker.on("failed", (job, err) => {
        console.error(`Job ${job?.id} failed:`, err);
      });
    })
    .catch((err) => {
      console.warn("⚠️ Worker: Redis not reachable in local environment, queuing in standby mode.", err.message);
    });
}

// Start worker if executed directly
if (require.main === module) {
  startWorker();
}
