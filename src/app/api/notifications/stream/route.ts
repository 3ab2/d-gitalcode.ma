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

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => {
        if (closed) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
      };

      const initialUnread = await getUnreadCount(userId);
      send({ type: "connected", unreadCount: initialUnread });

      const poll = async () => {
        if (closed) return;
        try {
          const newItems = await getNotificationsSince(userId, since);
          if (newItems.length > 0) {
            since = new Date(newItems[newItems.length - 1]!.createdAt);
            for (const item of newItems) {
              send({ type: "notification", notification: item });
            }
          }
          const unreadCount = await getUnreadCount(userId);
          send({ type: "unread_count", count: unreadCount });
        } catch (error) {
          console.error("[notifications/stream] poll error:", error);
        }
      };

      await poll();

      const pollId = setInterval(() => void poll(), POLL_MS);
      const heartbeatId = setInterval(() => {
        if (!closed) {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        }
      }, HEARTBEAT_MS);

      request.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(pollId);
        clearInterval(heartbeatId);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      });
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
