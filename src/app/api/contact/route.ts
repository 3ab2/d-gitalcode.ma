import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

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

    if (data.method === "FORM") {
      await sendContactNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        serviceName: data.serviceName,
        type: data.type,
      });
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
