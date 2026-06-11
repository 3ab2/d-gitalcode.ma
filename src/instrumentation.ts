export async function register() {
  if (process.env.NODE_ENV !== "production") return;

  const hasUrl = Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim());
  const hasToken = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN?.trim());

  if (!hasUrl || !hasToken) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production. " +
        "Rate limiting will fall back to in-memory buckets (not reliable on multi-instance Vercel). " +
        "See .env.example for deployment requirements."
    );
  }
}
