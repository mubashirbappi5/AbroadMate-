import { EmailService, EmailPayload } from "../services/emailService";

export async function processEmailDeliveryJob(payload: EmailPayload) {
  const result = await EmailService.sendEmail(payload);
  return result;
}
