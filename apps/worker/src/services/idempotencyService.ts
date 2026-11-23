import { prisma } from "@abroadmate/database";

export interface IdempotencyCheckParams {
  idempotencyKey: string;
  userId: string;
  channel: "IN_APP" | "EMAIL" | "TELEGRAM";
  category: "DEADLINE_REMINDER" | "POLICY_CHANGE" | "SOURCE_EXPIRY";
  referenceId: string;
  thresholdDays?: number | null;
  recipientEmail?: string | null;
}

export class IdempotencyService {
  /**
   * Checks whether this notification has already been dispatched.
   * If not, records the dispatch log in PostgreSQL and returns shouldDispatch: true.
   * If already dispatched, returns shouldDispatch: false (completely prevents duplicates).
   */
  static async checkAndRecord(params: IdempotencyCheckParams): Promise<{ shouldDispatch: boolean }> {
    try {
      // 1. Check if record already exists
      const existing = await prisma.notificationDispatchLog.findUnique({
        where: { idempotencyKey: params.idempotencyKey },
      });

      if (existing) {
        return { shouldDispatch: false };
      }

      // 2. Create dispatch record atomically
      await prisma.notificationDispatchLog.create({
        data: {
          idempotencyKey: params.idempotencyKey,
          userId: params.userId,
          channel: params.channel,
          category: params.category,
          referenceId: params.referenceId,
          thresholdDays: params.thresholdDays ?? null,
          recipientEmail: params.recipientEmail ?? null,
          dispatchedAt: new Date(),
        },
      });

      return { shouldDispatch: true };
    } catch (err: any) {
      // If concurrent request created the record, Prisma throws P2002 (Unique constraint)
      if (err.code === "P2002" || err.message?.includes("Unique constraint")) {
        return { shouldDispatch: false };
      }
      console.error("[IdempotencyService] Error checking idempotency key:", err);
      return { shouldDispatch: false };
    }
  }
}
