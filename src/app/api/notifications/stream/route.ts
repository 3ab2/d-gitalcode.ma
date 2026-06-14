import { auth } from "@/lib/auth";
import {
  getNotificationsSince,
  getUnreadCount,
} from "@/lib/notifications/service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_MS = 3000;
const HEARTBEAT_MS = 25000;

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const encoder = new TextEncoder();

  let since = new Date();
  let closed = false;
  let pollId: ReturnType<typeof setInterval> | undefined;
  let heartbeatId: ReturnType<typeof setInterval> | undefined;
  let cleanup: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      cleanup = () => {
        if (closed) return;
        closed = true;
        if (pollId) clearInterval(pollId);
        if (heartbeatId) clearInterval(heartbeatId);
        pollId = undefined;
        heartbeatId = undefined;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      const enqueue = (chunk: Uint8Array) => {
        if (closed) return false;
        try {
          controller.enqueue(chunk);
          return true;
        } catch {
          cleanup?.();
          return false;
        }
      };

      const send = (payload: unknown) => {
        enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const poll = async () => {
        if (closed) return;
        try {
          const newItems = await getNotificationsSince(userId, since);
          if (closed) return;

          if (newItems.length > 0) {
            since = new Date(newItems[newItems.length - 1]!.createdAt);
            for (const item of newItems) {
              if (closed) return;
              send({ type: "notification", notification: item });
            }
          }

          const unreadCount = await getUnreadCount(userId);
          if (closed) return;
          send({ type: "unread_count", count: unreadCount });
        } catch (error) {
          if (!closed) {
            console.error("[notifications/stream] poll error:", error);
          }
        }
      };

      void (async () => {
        const initialUnread = await getUnreadCount(userId);
        if (closed) return;
        send({ type: "connected", unreadCount: initialUnread });
        if (closed) return;

        await poll();
        if (closed) return;

        pollId = setInterval(() => {
          void poll();
        }, POLL_MS);

        heartbeatId = setInterval(() => {
          enqueue(encoder.encode(": heartbeat\n\n"));
        }, HEARTBEAT_MS);
      })();

      request.signal.addEventListener("abort", () => cleanup?.(), { once: true });
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
