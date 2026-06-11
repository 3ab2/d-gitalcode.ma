import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerClient } from "@/lib/auth";
import { enforceRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";
import { registerSchema } from "@/lib/register-validation";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const ipLimited = await enforceRateLimit(request, {
    name: "register",
    config: RATE_LIMITS.register,
    identifier: `register:ip:${ip}`,
  });
  if (ipLimited) return ipLimited;

  try {
    const body = await request.json();

    if (typeof body?.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const data = registerSchema.parse(body);

    const emailLimited = await enforceRateLimit(request, {
      name: "register-email",
      config: RATE_LIMITS.register,
      identifier: `register:email:${data.email}`,
    });
    if (emailLimited) return emailLimited;

    const result = await registerClient(data);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "email_exists",
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, user: result.user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "validation_failed", details: error.issues },
        { status: 400 }
      );
    }
    logError("register", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
