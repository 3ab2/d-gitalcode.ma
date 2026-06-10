export type PwaInstallEventName =
  | "popup_shown"
  | "install_accepted"
  | "install_dismissed"
  | "install_acknowledged";

export type PwaInstallEvent = {
  event: PwaInstallEventName;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

const QUEUE_KEY = "dgitalcode-pwa-analytics-queue";

function readQueue(): PwaInstallEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as PwaInstallEvent[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(events: PwaInstallEvent[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-50)));
}

/** Records PWA install funnel events locally; ready to flush to /api/analytics later. */
export function trackPwaInstallEvent(
  event: PwaInstallEventName,
  metadata?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const entry: PwaInstallEvent = {
    event,
    timestamp: new Date().toISOString(),
    metadata,
  };

  writeQueue([...readQueue(), entry]);

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: `pwa_${event}`,
      metadata,
    }),
  }).catch(() => {
    /* analytics optional */
  });
}

export function getPwaInstallEventQueue(): PwaInstallEvent[] {
  return readQueue();
}
