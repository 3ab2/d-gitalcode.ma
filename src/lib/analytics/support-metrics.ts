import { prisma } from "@/lib/prisma";

export type SupportMetrics = {
  openMessages: number;
  unreadMessages: number;
  messagesToday: number;
  messagesThisWeek: number;
  avgResponseTimeMinutes: number | null;
};

function startOfDay(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date = new Date()): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

async function computeAvgResponseTimeMinutes(): Promise<number | null> {
  const rows = await prisma.$queryRaw<Array<{ avg_minutes: number | null }>>`
    WITH first_replies AS (
      SELECT DISTINCT ON (r."messageId")
        r."messageId",
        r."createdAt" AS reply_at,
        m."createdAt" AS message_at
      FROM "MessageReply" r
      INNER JOIN "ClientMessage" m ON m.id = r."messageId"
      ORDER BY r."messageId", r."createdAt" ASC
    ),
    recent AS (
      SELECT message_at, reply_at
      FROM first_replies
      ORDER BY message_at DESC
      LIMIT 200
    )
    SELECT ROUND(AVG(EXTRACT(EPOCH FROM (reply_at - message_at)) / 60))::int AS avg_minutes
    FROM recent
  `;

  const value = rows[0]?.avg_minutes;
  return value !== null && value !== undefined ? Number(value) : null;
}

export async function aggregateSupportMetrics(): Promise<SupportMetrics> {
  const today = startOfDay();
  const weekStart = startOfWeek();

  const [
    openMessages,
    unreadMessages,
    messagesToday,
    messagesThisWeek,
    avgResponseTimeMinutes,
  ] = await Promise.all([
    prisma.clientMessage.count({ where: { status: "OPEN" } }),
    prisma.clientMessage.count({
      where: {
        status: "OPEN",
        replies: { none: {} },
      },
    }),
    prisma.clientMessage.count({
      where: { createdAt: { gte: today } },
    }),
    prisma.clientMessage.count({
      where: { createdAt: { gte: weekStart } },
    }),
    computeAvgResponseTimeMinutes(),
  ]);

  return {
    openMessages,
    unreadMessages,
    messagesToday,
    messagesThisWeek,
    avgResponseTimeMinutes,
  };
}
