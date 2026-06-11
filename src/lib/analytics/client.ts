/** Fire-and-forget analytics event (client-side only). */
export function sendAnalyticsEvent(
  event: string,
  page?: string,
  metadata?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, page, metadata }),
  }).catch(() => {
    /* analytics optional */
  });
}
