import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceName?: string;
  type: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL_NOTIFY || process.env.ADMIN_EMAIL;
  if (!resend || !adminEmail) {
    console.warn("Email not configured — skipping notification");
    return { success: false, reason: "not_configured" };
  }

  const subject = data.serviceName
    ? `[D-GITALCODE] Service Request: ${data.serviceName}`
    : `[D-GITALCODE] New Contact Message`;

  const html = `
    <h2>New ${data.type === "SERVICE_REQUEST" ? "Service Request" : "Contact"} Message</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    ${data.serviceName ? `<p><strong>Service:</strong> ${data.serviceName}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${data.message.replace(/\n/g, "<br>")}</p>
  `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "D-GITALCODE <noreply@d-gitalcode.ma>",
      to: adminEmail,
      replyTo: data.email,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, reason: "send_failed" };
  }
}

interface ReplyEmailData {
  to: string;
  subject: string;
  message: string;
  clientName: string;
}

export async function sendReplyEmail(data: ReplyEmailData) {
  if (!resend) {
    return { success: false, reason: "not_configured" };
  }

  const html = `
    <p>Bonjour ${data.clientName},</p>
    <div>${data.message.replace(/\n/g, "<br>")}</div>
    <br>
    <p>— L'équipe D-GITALCODE</p>
  `;

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "D-GITALCODE <noreply@d-gitalcode.ma>",
      to: data.to,
      subject: data.subject,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send reply:", error);
    return { success: false, reason: "send_failed", error: String(error) };
  }
}
