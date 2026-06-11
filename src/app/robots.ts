import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://d-gitalcode.ma";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/fr/login",
          "/en/login",
          "/ar/login",
          "/fr/register",
          "/en/register",
          "/ar/register",
          "/fr/support",
          "/en/support",
          "/ar/support",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
