import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerClient } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const result = await registerClient(data);

    if (!result.success) {
      return NextResponse.json(
        { error: "email_exists", message: "An account with this email already exists." },
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
    console.error("[register] Error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
