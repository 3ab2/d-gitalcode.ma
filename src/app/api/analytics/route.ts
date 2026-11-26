import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { aggregateBlogAnalytics } from "@/lib/analytics/aggregate-blog";
import { analyticsEventSchema } from "@/lib/analytics/validation";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalSubmissions,
      newSubmissions,
      newToday,
      whatsappClicks,
      formSubmissions,
      recentEvents,
      blogViews,
      totalServices,
      totalProjects,
      totalBlogPosts,
      publishedBlogPosts,
      submissionsByStatus,
      serviceRequests,
    ] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: "NEW" } }),
      prisma.contactSubmission.count({ where: { createdAt: { gte: today } } }),
      prisma.analyticsEvent.count({ where: { event: "whatsapp_click" } }),
      prisma.contactSubmission.count({ where: { method: "FORM" } }),
      prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.blogPost.aggregate({ _sum: { views: true } }),
      prisma.service.count(),
      prisma.portfolioProject.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.contactSubmission.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.contactSubmission.groupBy({
        by: ["serviceName"],
        where: { serviceName: { not: null }, type: "SERVICE_REQUEST" },
        _count: { serviceName: true },
        orderBy: { _count: { serviceName: "desc" } },
        take: 5,
      }),
    ]);

    const eventsByDay: Record<string, number> = {};
    recentEvents.forEach((e) => {
      const day = e.createdAt.toISOString().split("T")[0];
      eventsByDay[day] = (eventsByDay[day] || 0) + 1;
    });

    const submissionsByDay: Record<string, number> = {};
    const recentSubmissions = await prisma.contactSubmission.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    });
    recentSubmissions.forEach((s) => {
      const day = s.createdAt.toISOString().split("T")[0];
      submissionsByDay[day] = (submissionsByDay[day] || 0) + 1;
    });

    const blog = await aggregateBlogAnalytics(30);

    return NextResponse.json({
      totalSubmissions,
      newSubmissions,
      newToday,
      unreadSubmissions: newSubmissions,
      whatsappClicks,
      formSubmissions,
      blogViews: blogViews._sum.views || 0,
      totalServices,
      totalProjects,
      totalBlogPosts,
      publishedBlogPosts,
      submissionsByStatus: submissionsByStatus.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      mostRequestedServices: serviceRequests
        .filter((s) => s.serviceName)
        .map((s) => ({
          name: s.serviceName,
          count: s._count.serviceName,
        })),
      eventsByDay,
      submissionsByDay,
      recentEvents: recentEvents.slice(0, 10),
      blog,
    });
  } catch (error) {
    logError("analytics", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, {
    name: "analytics",
    config: RATE_LIMITS.analytics,
  });
  if (limited) return limited;

  try {
    const parsed = analyticsEventSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }
    await prisma.analyticsEvent.create({ data: parsed.data });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
