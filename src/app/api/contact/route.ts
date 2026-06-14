import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { enforceRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/settings";
import { logError } from "@/lib/logger";
import {
  contactSubmissionSchema,
  isFormExpired,
  isHoneypotTriggered,
  isSubmitTooFast,
  normalizeContactPayload,
} from "@/lib/contact-validation";
import { findRecentDuplicateLead } from "@/lib/leads/service";
import { sendLeadWebhook } from "@/lib/leads/webhook";
import { notifyAdminsNewLead } from "@/lib/notifications/events";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const limited = await enforceRateLimit(request, {
    name: "contact",
    config: RATE_LIMITS.contact,
    identifier: `contact:ip:${ip}`,
  });
  if (limited) return limited;

  try {
    const body = await request.json();

    if (isHoneypotTriggered(body?.website)) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const data = contactSubmissionSchema.parse(body);

    if (data.method === "FORM") {
      if (isSubmitTooFast(data.formLoadedAt)) {
        return NextResponse.json(
          { error: "rate_limit_exceeded", message: "Please wait before submitting." },
          { status: 429 }
        );
      }

      if (isFormExpired(data.formLoadedAt)) {
        return NextResponse.json(
          { error: "form_expired", message: "Form session expired. Please refresh and try again." },
          { status: 400 }
        );
      }
    }

    const payload = normalizeContactPayload(data);

    if (data.method === "FORM") {
      const duplicate = await findRecentDuplicateLead(payload.email, payload.message);
      if (duplicate) {
        return NextResponse.json({
          success: true,
          id: duplicate.id,
          duplicate: true,
        });
      }
    }

    const submission = await prisma.contactSubmission.create({
      data: payload,
    });

    const analyticsEvent =
      data.method === "WHATSAPP" ? "whatsapp_click" : "lead_form_submit";
    const analyticsPage =
      payload.sourcePage ||
      (payload.serviceName ? `service:${payload.serviceName}` : "contact");

    await prisma.analyticsEvent.create({
      data: {
        event: analyticsEvent,
        page: analyticsPage,
        metadata: {
          type: data.type,
          locale: data.locale,
          budgetRange: payload.budgetRange,
          sourcePage: payload.sourcePage,
        },
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
          name: payload.name,
          email: payload.email,
          phone: payload.phone ?? undefined,
          message: payload.message,
          serviceName: payload.serviceName ?? undefined,
          serviceInterest: payload.serviceInterest ?? undefined,
          budgetRange: payload.budgetRange ?? undefined,
          sourcePage: payload.sourcePage ?? undefined,
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

    await notifyAdminsNewLead({
      submissionId: submission.id,
      name: submission.name,
      email: submission.email,
      serviceName: submission.serviceName,
      sourcePage: submission.sourcePage,
    });

    void sendLeadWebhook({
      id: submission.id,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message,
      budgetRange: submission.budgetRange,
      sourcePage: submission.sourcePage,
      serviceInterest: submission.serviceInterest,
      serviceName: submission.serviceName,
      type: submission.type,
      method: submission.method,
      locale: submission.locale,
      createdAt: submission.createdAt.toISOString(),
    });

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
