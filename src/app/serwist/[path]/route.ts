import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
    additionalPrecacheEntries: [
      { url: "/offline", revision },
      { url: "/fr", revision },
      { url: "/en", revision },
      { url: "/ar", revision },
      { url: "/favicon.ico", revision },
      { url: "/icons/favicon-16x16.png", revision },
      { url: "/icons/favicon-32x32.png", revision },
      { url: "/icons/apple-touch-icon.png", revision },
      { url: "/icons/android-chrome-192x192.png", revision },
      { url: "/icons/android-chrome-512x512.png", revision },
      { url: "/icons/android-chrome-192x192-maskable.png", revision },
      { url: "/icons/android-chrome-512x512-maskable.png", revision },
    ],
  });
