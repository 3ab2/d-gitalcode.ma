import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import {
  enforceLoginRateLimit,
  extractCredentialsEmail,
} from "@/lib/rate-limit";

const { GET: authGET, POST: authPOST } = handlers;

export const GET = authGET;

function isCredentialsCallback(request: NextRequest): boolean {
  return new URL(request.url).pathname.includes("/callback/credentials");
}

export async function POST(request: NextRequest) {
  if (isCredentialsCallback(request)) {
    const email = await extractCredentialsEmail(request);
    const limited = await enforceLoginRateLimit(request, email);
    if (limited) return limited;
  }

  return authPOST(request);
}
