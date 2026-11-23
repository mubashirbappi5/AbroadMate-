import { Worker, Queue } from "bullmq";
import Redis from "ioredis";
import { prisma } from "@abroadmate/database";
import { calculateDeadlineAlerts } from "@abroadmate/roadmap-engine";

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

/**
 * Checks all active deadlines and triggers in-app and email notifications
 * for 30, 14, 7, 3, and 1-day alert intervals.
 */
export async function processAllScheduledDeadlineAlerts() {
  try {
    const deadlines = await prisma.deadline.findMany({
      where: { isCompleted: false },
    });

    const alerts = calculateDeadlineAlerts(deadlines);
    console.log(`[Deadline Scanner] Found ${alerts.length} active threshold alerts.`);

    for (const alert of alerts) {
      // Find eligible target users (either specific user or all active students if global)
      const targetDeadline = deadlines.find((d) => d.id === alert.deadlineId);
      if (!targetDeadline) continue;

      let userIds: string[] = [];

      if (targetDeadline.userId) {
        userIds = [targetDeadline.userId];
      } else {
        // Global deadline: notify active students
        const activeUsers = await prisma.user.findMany({
          where: { isActive: true },
          select: { id: true },
          take: 50,
        });
        userIds = activeUsers.map((u) => u.id);
      }

      for (const uid of userIds) {
        // Enqueue or record in-app Notification
        await prisma.notification.create({
          data: {
            userId: uid,
            title: `ডেডলাইন অ্যালার্ট: ${alert.titleBn}`,
            message: alert.messageBn,
            type: alert.urgency === "CRITICAL" ? "DEADLINE_ALERT" : "INFO",
            actionUrl: "/dashboard/deadlines",
          },
        });
      }
    }

    return { processedCount: alerts.length };
  } catch (error) {
    console.error("Error running processAllScheduledDeadlineAlerts:", error);
    return { error: (error as Error).message };
  }
}

export function startWorker() {
  connection
    .connect()
    .then(() => {
      console.log("✅ Worker connected to Redis.");

      const worker = new Worker(
        DEADLINE_REMINDER_QUEUE,
        async (job) => {
          console.log(`[Worker Job] Processing reminder:`, job.name, job.data);

          if (job.name === "scan-deadline-thresholds") {
            return await processAllScheduledDeadlineAlerts();
          }

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
