import { createSerwistRoute } from "@serwist/turbopack";

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
    // Public icons and favicon are already in the build precache manifest.
    // Manual entries here caused duplicate URLs with conflicting revisions.
  });
