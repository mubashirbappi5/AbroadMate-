import {
  deadlineReminderQueue,
  sourceMonitoringQueue,
  periodicDataVerificationQueue,
} from "../queues";

export async function registerCronSchedulers() {
  console.log("⏰ Registering BullMQ Repeatable Schedulers (UTC)...");

  // 1. Deadline threshold reminder scanner (Every 6 hours)
  await deadlineReminderQueue.upsertJobScheduler(
    "scheduler-deadline-reminders-6h",
    { pattern: "0 */6 * * *" },
    {
      name: "scan-deadline-thresholds",
      data: { trigger: "CRON_6H" },
    }
  );

  // 2. Source review date expiration scanner (Every 12 hours)
  await sourceMonitoringQueue.upsertJobScheduler(
    "scheduler-source-monitoring-12h",
    { pattern: "0 */12 * * *" },
    {
      name: "scan-overdue-sources",
      data: { trigger: "CRON_12H" },
    }
  );

  // 3. Periodic data verification & exchange rate audit (Every 24 hours at 00:00 UTC)
  await periodicDataVerificationQueue.upsertJobScheduler(
    "scheduler-periodic-verification-daily",
    { pattern: "0 0 * * *" },
    {
      name: "audit-data-integrity",
      data: { trigger: "CRON_DAILY_UTC" },
    }
  );

  console.log("✅ Repeatable Cron Schedulers successfully registered.");
}
