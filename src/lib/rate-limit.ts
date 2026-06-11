import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logError, logWarn } from "@/lib/logger";

type LimitConfig = {
  requests: number;
  window: `${number} ${"s" | "m" | "h" | "d"}`;
};

const limiters = new Map<string, Ratelimit>();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function getLimiter(name: string, config: LimitConfig): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  const cacheKey = `${name}:${config.requests}:${config.window}`;
  if (!limiters.has(cacheKey)) {
    const redis = new Redis({ url, token });
    limiters.set(
      cacheKey,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
        prefix: `ratelimit:${name}`,
        analytics: true,
      })
    );
  }

  return limiters.get(cacheKey)!;
}

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(
  identifier: string,
  config: LimitConfig
): { success: boolean; remaining: number } {
  const windowMs = parseWindowMs(config.window);
  const now = Date.now();
  const bucket = memoryBuckets.get(identifier);

  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: config.requests - 1 };
  }

  if (bucket.count >= config.requests) {
    return { success: false, remaining: 0 };
  }

  bucket.count += 1;
  return { success: true, remaining: config.requests - bucket.count };
}

function parseWindowMs(window: LimitConfig["window"]): number {
  const [amount, unit] = window.split(" ") as [string, string];
  const n = parseInt(amount, 10);
  switch (unit) {
    case "s":
      return n * 1000;
    case "m":
      return n * 60_000;
    case "h":
      return n * 3_600_000;
    case "d":
      return n * 86_400_000;
    default:
      return 60_000;
  }
}

function applyMemoryFallback(
  identifier: string,
  config: LimitConfig
): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    logWarn("rate-limit", "redis_unavailable_using_memory_fallback", {
      identifier,
    });
  }

  const memoryResult = memoryRateLimit(identifier, config);
  if (!memoryResult.success) {
    return NextResponse.json(
      {
        error: "rate_limit_exceeded",
        message: "Too many requests. Please try again later.",
      },
      { status: 429 }
    );
  }

  return null;
}

export async function enforceRateLimit(
  request: NextRequest,
  options: {
    name: string;
    config: LimitConfig;
    identifier?: string;
  }
): Promise<NextResponse | null> {
  const identifier =
    options.identifier ?? `${options.name}:${getClientIp(request)}`;

  const limiter = getLimiter(options.name, options.config);

  if (limiter) {
    try {
      const result = await limiter.limit(identifier);
      if (!result.success) {
        return NextResponse.json(
          {
            error: "rate_limit_exceeded",
            message: "Too many requests. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(
                Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
              ),
              "X-RateLimit-Remaining": String(result.remaining),
            },
          }
        );
      }
      return null;
    } catch (error) {
      logError("rate-limit", error, { event: "redis_error", identifier });
      return applyMemoryFallback(identifier, options.config);
    }
  }

  return applyMemoryFallback(identifier, options.config);
}

export const RATE_LIMITS = {
  contact: { requests: 8, window: "1 h" as const },
  messages: { requests: 30, window: "1 h" as const },
  register: { requests: 5, window: "1 h" as const },
  analytics: { requests: 120, window: "1 m" as const },
  login: { requests: 10, window: "15 m" as const },
} satisfies Record<string, LimitConfig>;

export async function enforceLoginRateLimit(
  request: NextRequest,
  email: string | null
): Promise<NextResponse | null> {
  const ip = getClientIp(request);

  const ipLimited = await enforceRateLimit(request, {
    name: "login-ip",
    config: RATE_LIMITS.login,
    identifier: `login:ip:${ip}`,
  });
  if (ipLimited) return ipLimited;

  if (email) {
    return enforceRateLimit(request, {
      name: "login-email",
      config: RATE_LIMITS.login,
      identifier: `login:email:${email}`,
    });
  }

  return null;
}

export async function extractCredentialsEmail(
  request: NextRequest
): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.clone().formData();
      const email = form.get("email");
      return typeof email === "string" ? email.trim().toLowerCase() : null;
    }

    if (contentType.includes("application/json")) {
      const body = await request.clone().json();
      return typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : null;
    }
  } catch {
    return null;
  }

  return null;
}
