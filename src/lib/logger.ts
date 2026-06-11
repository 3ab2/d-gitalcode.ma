type LogContext = Record<string, unknown>;

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "unknown_error";
  }
}

/** Production-safe structured error logging (no stack dumps in prod). */
export function logError(scope: string, error: unknown, context?: LogContext): void {
  const payload = {
    scope,
    error: formatError(error),
    ...context,
  };

  if (process.env.NODE_ENV === "production") {
    console.error(`[${scope}]`, JSON.stringify(payload));
    return;
  }

  console.error(`[${scope}]`, payload, error);
}

export function logWarn(scope: string, message: string, context?: LogContext): void {
  const payload = { message, ...context };
  console.warn(`[${scope}]`, process.env.NODE_ENV === "production" ? JSON.stringify(payload) : payload);
}
