import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.$connect();
  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
  `;
  const counts = {
    services: await prisma.service.count(),
    blog: await prisma.blogPost.count(),
    portfolio: await prisma.portfolioProject.count(),
    users: await prisma.user.count(),
  };
  console.log("DB_CONNECT_OK");
  console.log("TABLES:", tables.map((t) => t.tablename).join(", "));
  console.log("COUNTS:", JSON.stringify(counts));
} catch (error) {
  console.error("DB_ERROR:", error.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
