import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/settings";
import { logError } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5),
  locale: z.string().default("fr"),
  type: z.enum(["GENERAL", "SERVICE_REQUEST"]).default("GENERAL"),
  method: z.enum(["FORM", "WHATSAPP"]).default("FORM"),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, {
    name: "contact",
    config: RATE_LIMITS.contact,
  });
  if (limited) return limited;

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        locale: data.locale,
        type: data.type,
        method: data.method,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        event: data.method === "WHATSAPP" ? "whatsapp_click" : "form_submit",
        page: data.serviceName ? `service:${data.serviceName}` : "contact",
        metadata: { type: data.type, locale: data.locale },
      },
    });

    let emailNotification: { sent: boolean; reason?: string; error?: string } = {
      sent: false,
      reason: "skipped",
    };

    if (data.method === "FORM") {
      const settings = await getSiteSettings();
      const emailResult = await sendContactNotification(
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          serviceName: data.serviceName,
          type: data.type,
        },
        { notifyEmail: settings.contactEmail }
      );

      emailNotification = emailResult.success
        ? { sent: true }
        : {
            sent: false,
            reason: emailResult.reason,
            error: emailResult.error,
          };

      if (!emailResult.success) {
        console.warn("[contact] Submission saved but email failed:", emailNotification);
      }
    }

    return NextResponse.json({
      success: true,
      id: submission.id,
      emailNotification,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    logError("contact", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
