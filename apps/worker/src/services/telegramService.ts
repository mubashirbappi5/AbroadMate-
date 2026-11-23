/**
 * AbroadMate Telegram Bot Notification Adapter
 * Future-ready push alert channel for students who link their Telegram Chat ID.
 */

export interface TelegramPayload {
  chatId: string;
  title: string;
  messageBn: string;
  actionUrl?: string | null;
}

export class TelegramService {
  /**
   * Dispatches push message to Telegram Bot API
   */
  static async sendMessage(payload: TelegramPayload): Promise<{ success: boolean; delivered: boolean }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    const formattedText = `
*AbroadMate AI Alert* 🎓
━━━━━━━━━━━━━━━━━━━━
*${payload.title}*

${payload.messageBn}

${payload.actionUrl ? `🔗 [AbroadMate পোর্টালে দেখুন](${payload.actionUrl})` : ""}
    `.trim();

    console.log(`[TelegramService] Sending push notification to Chat ID: ${payload.chatId}`);

    if (botToken) {
      try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: payload.chatId,
            text: formattedText,
            parse_mode: "Markdown",
            disable_web_page_preview: false,
          }),
        });

        const json = await res.json();
        return { success: true, delivered: json.ok === true };
      } catch (err) {
        console.warn("[TelegramService] Error communicating with Telegram API:", err);
        return { success: false, delivered: false };
      }
    }

    // In local / development mode
    return { success: true, delivered: true };
  }
}
