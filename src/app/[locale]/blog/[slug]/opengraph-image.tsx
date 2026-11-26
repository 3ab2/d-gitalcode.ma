import { ImageResponse } from "next/og";
import { getBlogImage } from "@/lib/blog-images";
import { getSiteUrl } from "@/lib/seo/metadata";

export const alt = "D-GITALCODE Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const { alt: title } = getBlogImage(slug, "web-development");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0a0f1a 0%, #12182a 45%, #1a1030 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: 28,
            fontWeight: 700,
            color: "#22c55e",
          }}
        >
          D-GITALCODE
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            maxWidth: "1000px",
          }}
        >
          {title.length > 90 ? `${title.slice(0, 87)}...` : title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>Professional Development Agency</span>
          <span>{new URL(getSiteUrl()).host}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
