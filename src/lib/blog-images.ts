export type BlogImageMapping = {
  slug: string;
  image: string;
  alt: string;
};

export const BLOG_IMAGE_DEFAULT = "/images/blog-default.jpg";

const UNSPLASH_BASE = "https://images.unsplash.com";

/** Featured articles use premium hero crops (slightly larger, higher quality). */
export const FEATURED_BLOG_SLUGS = new Set([
  "nextjs-vs-traditional-cms-2026",
  "flutter-vs-react-native-2026",
  "build-saas-mvp-90-days",
  "nextjs-app-router-patterns",
]);

/** Category keyword pools for unknown / future articles */
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

/**
 * Explicit 1:1 cover mapping — 50 unique verified Unsplash photos.
 * Each ID is category-themed and never reused across articles.
 */
const ARTICLE_COVER_PHOTOS: Record<string, string> = {
  // Web Development (code, architecture, workspace)
  "nextjs-vs-traditional-cms-2026": "photo-1498050108023-c5249f4df085",
  "headless-commerce-architecture-guide": "photo-1461749280684-dccba630e2f6",
  "web-performance-core-vitals-checklist": "photo-1555066931-4365d14bab8c",
  "api-first-web-development-strategy": "photo-1451187580459-43490279c0fa",
  "choosing-tech-stack-startup-website": "photo-1504384308090-c894fdcc538d",

  // Mobile Apps (devices, screens, app development)
  "flutter-vs-react-native-2026": "photo-1512941937669-90a1b58e7e9c",
  "mobile-app-mvp-launch-checklist": "photo-1511707171634-5f897ff02aa9",
  "app-store-optimization-basics": "photo-1526498460520-4c246339dccb",
  "offline-first-mobile-architecture": "photo-1563986768494-4dee2763ff3f",
  "push-notifications-mobile-retention": "photo-1556656793-08538906a9f8",

  // UI/UX (design, wireframes, interfaces)
  "saas-dashboard-ux-patterns": "photo-1561070791-2526d30994b5",
  "design-systems-scale-products": "photo-1558655146-d09347e92766",
  "conversion-focused-landing-pages": "photo-1547658719-da2b51169166",
  "accessibility-wcag-product-teams": "photo-1542831371-d531d36971e6",
  "micro-interactions-ux-impact": "photo-1486312338219-ce68d2c6f44d",

  // SaaS (dashboards, analytics, business software)
  "build-saas-mvp-90-days": "photo-1551288049-bebda4e38f71",
  "subscription-billing-stripe-architecture": "photo-1460925895917-afdab827c52f",
  "multi-tenant-saas-database-design": "photo-1504868584819-f8e8b4b6d7e3",
  "saas-onboarding-reduce-churn": "photo-1551434678-e076c223a692",
  "saas-pricing-models-guide": "photo-1543286386-713bdd548da4",

  // SEO (search, analytics, growth metrics)
  "technical-seo-nextjs-checklist": "photo-1600880292203-757bb62b4baf",
  "content-cluster-strategy-agencies": "photo-1504639725590-34d0984388bd",
  "local-seo-morocco-businesses": "photo-1556761175-b413da4baf72",
  "seo-audit-framework-2026": "photo-1552664730-d307ca884978",
  "structured-data-rich-results": "photo-1557804506-669a67965ba0",

  // Cybersecurity (locks, networks, authentication)
  "web-app-security-owasp-basics": "photo-1555949963-aa79dcee981c",
  "authentication-jwt-vs-sessions": "photo-1633265486064-086b219458ec",
  "secure-api-design-practices": "photo-1550751827-4bd374c3f58b",
  "gdpr-compliance-web-projects": "photo-1558494949-ef010cbdcc31",
  "ssl-https-deployment-guide": "photo-1571171637578-41bc2dd41cd2",

  // JavaScript / TypeScript (code, dev environments)
  "typescript-best-practices-2026": "photo-1627398242454-45a1465c2479",
  "javascript-performance-patterns": "photo-1516116216624-53e697fedbea",
  "nodejs-production-deployment": "photo-1516321318423-f06f85e504b3",
  "esm-vs-commonjs-modern-node": "photo-1517180102446-f3ece451e9d8",
  "testing-strategies-typescript-apps": "photo-1587620962725-abab7fe55159",

  // React / Next.js (frontend, components, performance)
  "nextjs-app-router-patterns": "photo-1633356122544-f134324a6cee",
  "react-server-components-explained": "photo-1556742049-0cfed4f6a45d",
  "state-management-react-2026": "photo-1580915411954-282cb1b0d780",
  "nextjs-seo-metadata-api": "photo-1581291518857-4e27b48ff24e",
  "react-performance-optimization": "photo-1601784551446-20c9e07cdbdb",

  // Business & Digital Transformation (teams, strategy, productivity)
  "digital-transformation-smes-morocco": "photo-1454165804606-c3d57bc86b40",
  "roi-measuring-web-projects": "photo-1553877522-43269d4ea984",
  "ecommerce-growth-strategy-2026": "photo-1563013544-824ae1b704d3",
  "crm-integration-sales-pipelines": "photo-1542744173-8e7e53415bb0",
  "automation-workflows-business": "photo-1507679799987-c73779587ccf",

  // Freelancing (remote work, clients, workspace)
  "win-high-value-dev-clients": "photo-1600880292089-90a7e086ee0c",
  "freelance-proposal-templates-work": "photo-1497215728101-856f4ea42174",
  "pricing-freelance-web-projects": "photo-1519389950473-47ba0277781c",
  "portfolio-case-studies-convert": "photo-1522071820081-009f0129c71c",
  "agency-vs-freelancer-hiring-guide": "photo-1522202176988-66273c2fd55f",
};

/** Fallback pool per category for articles outside the curated 50 */
const CATEGORY_FALLBACK_PHOTOS: Record<string, string[]> = {
  "web-development": ["photo-1498050108023-c5249f4df085"],
  "mobile-apps": ["photo-1512941937669-90a1b58e7e9c"],
  "ui-ux": ["photo-1561070791-2526d30994b5"],
  saas: ["photo-1551288049-bebda4e38f71"],
  seo: ["photo-1600880292203-757bb62b4baf"],
  cybersecurity: ["photo-1555949963-aa79dcee981c"],
  "javascript-typescript": ["photo-1627398242454-45a1465c2479"],
  "react-nextjs": ["photo-1633356122544-f134324a6cee"],
  "business-digital": ["photo-1556761175-b413da4baf72"],
  freelancing: ["photo-1522071820081-009f0129c71c"],
  woocommerce: ["photo-1556742049-0cfed4f6a45d"],
};

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

export function buildUnsplashUrl(
  photoId: string,
  slug?: string,
  width = 1200,
  height = 630
): string {
  const isFeatured = slug ? FEATURED_BLOG_SLUGS.has(slug) : false;
  const w = isFeatured ? 1400 : width;
  const h = isFeatured ? 735 : height;
  const q = isFeatured ? 85 : 80;
  return `${UNSPLASH_BASE}/${photoId}?auto=format&fit=crop&crop=entropy&w=${w}&h=${h}&q=${q}`;
}

function resolvePhotoId(slug: string, category: string): string {
  const explicit = ARTICLE_COVER_PHOTOS[slug];
  if (explicit) return explicit;

  const pool =
    CATEGORY_FALLBACK_PHOTOS[category] ??
    CATEGORY_FALLBACK_PHOTOS["web-development"];
  return pool[0];
}

function isPersistedImage(src: string): boolean {
  if (!src || src.trim() === "") return false;
  if (src.startsWith("/")) return true;
  return src.includes("cloudinary.com") || src.includes("res.cloudinary.com");
}

/** Centralized slug → image map for all seeded blog articles */
export const BLOG_IMAGE_MAPPINGS: BlogImageMapping[] = BLOG_SLUG_METADATA.map(
  ({ slug, category, alt }) => ({
    slug,
    image: buildUnsplashUrl(resolvePhotoId(slug, category), slug),
    alt,
  })
);

const BLOG_IMAGE_MAP = new Map(
  BLOG_IMAGE_MAPPINGS.map((entry) => [entry.slug, entry])
);

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

  const photoId = resolvePhotoId(slug, category);
  return {
    slug,
    image: buildUnsplashUrl(photoId, slug) || BLOG_IMAGE_DEFAULT,
    alt: title?.trim() || `D-GITALCODE blog — ${category.replace(/-/g, " ")}`,
  };
}

export function resolveBlogPostImage(options: {
  slug: string;
  category: string;
  title: string;
  dbImage?: string | null;
}): BlogImageMapping {
  const { slug, category, title, dbImage } = options;

  if (dbImage && isPersistedImage(dbImage)) {
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

/** Audit helper: returns duplicate groups among curated article covers */
export function auditBlogImageDiversity(): {
  totalArticles: number;
  uniqueImages: number;
  duplicateGroups: Array<{ photoId: string; slugs: string[] }>;
  byCategory: Record<string, number>;
} {
  const byImage = new Map<string, string[]>();
  const byCategory: Record<string, number> = {};

  for (const { slug, category } of BLOG_SLUG_METADATA) {
    byCategory[category] = (byCategory[category] ?? 0) + 1;
    const photoId = ARTICLE_COVER_PHOTOS[slug] ?? "unknown";
    if (!byImage.has(photoId)) byImage.set(photoId, []);
    byImage.get(photoId)!.push(slug);
  }

  const duplicateGroups = [...byImage.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([photoId, slugs]) => ({ photoId, slugs }));

  return {
    totalArticles: BLOG_SLUG_METADATA.length,
    uniqueImages: byImage.size,
    duplicateGroups,
    byCategory,
  };
}
