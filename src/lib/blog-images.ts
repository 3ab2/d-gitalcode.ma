export type BlogImageMapping = {
  slug: string;
  image: string;
  alt: string;
};

export const BLOG_IMAGE_DEFAULT = "/images/blog-default.jpg";

const UNSPLASH_BASE = "https://images.unsplash.com";

/** Category keyword pools for dynamic Unsplash selection */
export const CATEGORY_IMAGE_KEYWORDS: Record<string, string> = {
  "web-development": "programming,code,laptop",
  "mobile-apps": "mobile,app,smartphone",
  "ui-ux": "design,UI,interface",
  saas: "dashboard,analytics,software",
  seo: "search,optimization,marketing",
  cybersecurity: "security,shield,lock",
  "javascript-typescript": "javascript,code,developer",
  "react-nextjs": "react,frontend,development",
  "business-digital": "startup,office,growth",
  freelancing: "freelancer,workspace,remote",
  woocommerce: "ecommerce,online,shopping",
};

/** Curated stable Unsplash photo IDs per category (no API key required) */
const CATEGORY_PHOTO_POOLS: Record<string, string[]> = {
  "web-development": [
    "photo-1498050108023-c5249f4df085",
    "photo-1461749280684-dccba630e2f6",
    "photo-1517694712202-14dd9538d97c",
    "photo-1555066931-4365d14bab8c",
    "photo-1531486319856-e966f65f0b39",
  ],
  "mobile-apps": [
    "photo-1512941937669-90a1b58e7e9c",
    "photo-1551650975-87deeed944c3",
    "photo-1555774698-56c412f8949b",
    "photo-1563986768605-319daed8313d",
    "photo-1512428559080-fdca8d1e602b",
  ],
  "ui-ux": [
    "photo-1561070791-2526d30994b5",
    "photo-1586717791821-4075082a3c9f",
    "photo-1558655146-d09347e92766",
    "photo-1559028012-481d77242b97",
    "photo-1547658719-da2b51169166",
  ],
  saas: [
    "photo-1551288049-bebda4e38f71",
    "photo-1460925895917-afdab827c52f",
    "photo-1504868584819-f8e8b4b6d7e3",
    "photo-1551434678-e076c223a692",
    "photo-1543286386-713bdd548da4",
  ],
  seo: [
    "photo-1562577302-2592b9b9bfad",
    "photo-1526621235311-2b951c60d654",
    "photo-1573164713714-d95e4360578e",
    "photo-1600880292203-757bb62b4baf",
    "photo-1432888496226-cefdf01c3b77",
  ],
  cybersecurity: [
    "photo-1555949963-aa79dcee981c",
    "photo-1614064641938-3bbee5293b8e",
    "photo-1633265486064-086b219458ec",
    "photo-1550751827-4bd374c3f58b",
    "photo-1563986768605-319daed8313d",
  ],
  "javascript-typescript": [
    "photo-1627398242454-45a1465c2479",
    "photo-1605372952655-a8cba6b6a5b8",
    "photo-1593720213428-6a751b1bdd42",
    "photo-1516116216624-53e697fedbea",
    "photo-1555066931-4365d14bab8c",
  ],
  "react-nextjs": [
    "photo-1633356122544-f134324a6cee",
    "photo-1618477247222-acf0bb5acb25",
    "photo-1555098862-66919ba87bff",
    "photo-1587620962725-abab7fe55159",
    "photo-1599508616912-dfd0de67ab58",
  ],
  "business-digital": [
    "photo-1556761175-b413da4baf72",
    "photo-1553877522-43269d4ea984",
    "photo-1521737718192-f9499790479e",
    "photo-1542744173-8e7e53415bb0",
    "photo-1460925895917-afdab827c52f",
  ],
  freelancing: [
    "photo-1522071820081-009f0129c71c",
    "photo-1497215728101-856f4ea42174",
    "photo-1519389950473-47ba0277781c",
    "photo-1573496359142-b8d87734a5a9",
    "photo-1600880292089-90a7e086ee0c",
  ],
  woocommerce: [
    "photo-1556742049-0cfed4f6a45d",
    "photo-1472851294608-062f824d1829",
    "photo-1563013544-824ae1b704d3",
  ],
};

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function buildUnsplashUrl(
  photoId: string,
  width = 1200,
  height = 630
): string {
  return `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;
}

function pickCategoryPhoto(slug: string, category: string): string {
  const pool =
    CATEGORY_PHOTO_POOLS[category] ?? CATEGORY_PHOTO_POOLS["web-development"];
  const photoId = pool[hashSlug(slug) % pool.length];
  return buildUnsplashUrl(photoId);
}

function isLocalOrTrustedImage(src: string): boolean {
  if (!src || src.trim() === "") return false;
  if (src.startsWith("/")) return true;
  return (
    src.includes("cloudinary.com") ||
    src.includes("images.unsplash.com") ||
    src.includes("res.cloudinary.com")
  );
}

/** Slug metadata for all 50 blog articles */
const BLOG_SLUG_METADATA: Array<{ slug: string; category: string; alt: string }> = [
  { slug: "nextjs-vs-traditional-cms-2026", category: "web-development", alt: "Next.js vs Traditional CMS in 2026" },
  { slug: "headless-commerce-architecture-guide", category: "web-development", alt: "Headless Commerce Architecture Guide" },
  { slug: "web-performance-core-vitals-checklist", category: "web-development", alt: "Core Web Vitals Checklist for Fast Websites" },
  { slug: "api-first-web-development-strategy", category: "web-development", alt: "API-First Web Development Strategy" },
  { slug: "choosing-tech-stack-startup-website", category: "web-development", alt: "Choosing a Tech Stack for Startup Websites" },
  { slug: "flutter-vs-react-native-2026", category: "mobile-apps", alt: "Flutter vs React Native in 2026" },
  { slug: "mobile-app-mvp-launch-checklist", category: "mobile-apps", alt: "Mobile App MVP Launch Checklist" },
  { slug: "app-store-optimization-basics", category: "mobile-apps", alt: "App Store Optimization Basics" },
  { slug: "offline-first-mobile-architecture", category: "mobile-apps", alt: "Offline-First Mobile Architecture" },
  { slug: "push-notifications-mobile-retention", category: "mobile-apps", alt: "Push Notifications and Mobile Retention" },
  { slug: "saas-dashboard-ux-patterns", category: "ui-ux", alt: "SaaS Dashboard UX Patterns" },
  { slug: "design-systems-scale-products", category: "ui-ux", alt: "Design Systems That Scale Products" },
  { slug: "conversion-focused-landing-pages", category: "ui-ux", alt: "Conversion-Focused Landing Pages" },
  { slug: "accessibility-wcag-product-teams", category: "ui-ux", alt: "WCAG Accessibility for Product Teams" },
  { slug: "micro-interactions-ux-impact", category: "ui-ux", alt: "Micro-interactions UX Impact" },
  { slug: "build-saas-mvp-90-days", category: "saas", alt: "Build a SaaS MVP in 90 Days" },
  { slug: "subscription-billing-stripe-architecture", category: "saas", alt: "Stripe Subscription Billing Architecture" },
  { slug: "multi-tenant-saas-database-design", category: "saas", alt: "Multi-Tenant SaaS Database Design" },
  { slug: "saas-onboarding-reduce-churn", category: "saas", alt: "SaaS Onboarding to Reduce Churn" },
  { slug: "saas-pricing-models-guide", category: "saas", alt: "SaaS Pricing Models Guide" },
  { slug: "technical-seo-nextjs-checklist", category: "seo", alt: "Technical SEO Next.js Checklist" },
  { slug: "content-cluster-strategy-agencies", category: "seo", alt: "Content Cluster Strategy for Agencies" },
  { slug: "local-seo-morocco-businesses", category: "seo", alt: "Local SEO for Morocco Businesses" },
  { slug: "seo-audit-framework-2026", category: "seo", alt: "Professional SEO Audit Framework" },
  { slug: "structured-data-rich-results", category: "seo", alt: "Structured Data and Rich Results" },
  { slug: "web-app-security-owasp-basics", category: "cybersecurity", alt: "Web App Security OWASP Basics" },
  { slug: "authentication-jwt-vs-sessions", category: "cybersecurity", alt: "JWT vs Sessions Authentication" },
  { slug: "secure-api-design-practices", category: "cybersecurity", alt: "Secure API Design Practices" },
  { slug: "gdpr-compliance-web-projects", category: "cybersecurity", alt: "GDPR Compliance for Web Projects" },
  { slug: "ssl-https-deployment-guide", category: "cybersecurity", alt: "SSL HTTPS Deployment Guide" },
  { slug: "typescript-best-practices-2026", category: "javascript-typescript", alt: "TypeScript Best Practices 2026" },
  { slug: "javascript-performance-patterns", category: "javascript-typescript", alt: "JavaScript Performance Patterns" },
  { slug: "nodejs-production-deployment", category: "javascript-typescript", alt: "Node.js Production Deployment" },
  { slug: "esm-vs-commonjs-modern-node", category: "javascript-typescript", alt: "ESM vs CommonJS in Modern Node" },
  { slug: "testing-strategies-typescript-apps", category: "javascript-typescript", alt: "Testing Strategies for TypeScript Apps" },
  { slug: "nextjs-app-router-patterns", category: "react-nextjs", alt: "Next.js App Router Patterns" },
  { slug: "react-server-components-explained", category: "react-nextjs", alt: "React Server Components Explained" },
  { slug: "state-management-react-2026", category: "react-nextjs", alt: "React State Management in 2026" },
  { slug: "nextjs-seo-metadata-api", category: "react-nextjs", alt: "Next.js SEO Metadata API Guide" },
  { slug: "react-performance-optimization", category: "react-nextjs", alt: "React Performance Optimization" },
  { slug: "digital-transformation-smes-morocco", category: "business-digital", alt: "Digital Transformation for SMEs in Morocco" },
  { slug: "roi-measuring-web-projects", category: "business-digital", alt: "Measuring ROI of Web Projects" },
  { slug: "ecommerce-growth-strategy-2026", category: "business-digital", alt: "eCommerce Growth Strategy 2026" },
  { slug: "crm-integration-sales-pipelines", category: "business-digital", alt: "CRM Integration and Sales Pipelines" },
  { slug: "automation-workflows-business", category: "business-digital", alt: "Business Workflow Automation" },
  { slug: "win-high-value-dev-clients", category: "freelancing", alt: "Win High-Value Development Clients" },
  { slug: "freelance-proposal-templates-work", category: "freelancing", alt: "Freelance Proposal Templates That Work" },
  { slug: "pricing-freelance-web-projects", category: "freelancing", alt: "Pricing Freelance Web Projects" },
  { slug: "portfolio-case-studies-convert", category: "freelancing", alt: "Portfolio Case Studies That Convert" },
  { slug: "agency-vs-freelancer-hiring-guide", category: "freelancing", alt: "Agency vs Freelancer Hiring Guide 2026" },
];

/** Centralized slug → image map for all seeded blog articles */
export const BLOG_IMAGE_MAPPINGS: BlogImageMapping[] = BLOG_SLUG_METADATA.map(
  ({ slug, category, alt }) => ({
    slug,
    image: pickCategoryPhoto(slug, category),
    alt,
  })
);

const BLOG_IMAGE_MAP = new Map(
  BLOG_IMAGE_MAPPINGS.map((entry) => [entry.slug, entry])
);

/**
 * Resolve image for a blog post by slug and category.
 * Uses explicit slug mapping first, then category-based Unsplash pool.
 */
export function getBlogImage(
  slug: string,
  category: string,
  title?: string
): BlogImageMapping {
  const mapped = BLOG_IMAGE_MAP.get(slug);
  if (mapped) {
    return {
      slug,
      image: mapped.image,
      alt: title?.trim() || mapped.alt,
    };
  }

  const keywords = CATEGORY_IMAGE_KEYWORDS[category] ?? "technology,digital";
  const fallbackImage = pickCategoryPhoto(slug || keywords, category);

  return {
    slug,
    image: fallbackImage || BLOG_IMAGE_DEFAULT,
    alt: title?.trim() || `D-GITALCODE blog — ${category.replace(/-/g, " ")}`,
  };
}

/**
 * Prefer a valid DB/uploaded image; otherwise resolve via mapping system.
 */
export function resolveBlogPostImage(options: {
  slug: string;
  category: string;
  title: string;
  dbImage?: string | null;
}): BlogImageMapping {
  const { slug, category, title, dbImage } = options;

  if (dbImage && isLocalOrTrustedImage(dbImage)) {
    return { slug, image: dbImage, alt: title };
  }

  const resolved = getBlogImage(slug, category, title);
  return {
    slug,
    image: resolved.image || BLOG_IMAGE_DEFAULT,
    alt: resolved.alt || title,
  };
}

export function getBlogImageAbsoluteUrl(
  imagePath: string,
  siteUrl?: string
): string {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://d-gitalcode.ma";
  if (imagePath.startsWith("http")) return imagePath;
  return `${base.replace(/\/$/, "")}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

export function getPrimaryCategorySlug(
  categories: Array<{ category: { slug: string } }>
): string {
  return categories[0]?.category.slug ?? "web-development";
}
