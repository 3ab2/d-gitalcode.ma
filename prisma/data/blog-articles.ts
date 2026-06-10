export type BlogArticleSeed = {
  slug: string;
  category: string;
  tags: string[];
  featured?: boolean;
  daysAgo: number;
  titles: { fr: string; en: string; ar: string };
  excerpts: { fr: string; en: string; ar: string };
  keywords: string[];
  sections: { fr: string[]; en: string[]; ar: string[] };
};

export const BLOG_CATEGORIES: Record<
  string,
  { fr: string; en: string; ar: string }
> = {
  "web-development": {
    fr: "Développement Web",
    en: "Web Development",
    ar: "تطوير الويب",
  },
  "mobile-apps": {
    fr: "Applications Mobiles",
    en: "Mobile Apps",
    ar: "تطبيقات الجوال",
  },
  "ui-ux": { fr: "UI/UX Design", en: "UI/UX Design", ar: "تصميم UI/UX" },
  saas: { fr: "Plateformes SaaS", en: "SaaS Platforms", ar: "منصات SaaS" },
  seo: { fr: "SEO & Visibilité", en: "SEO Optimization", ar: "تحسين SEO" },
  cybersecurity: {
    fr: "Cybersécurité",
    en: "Cybersecurity",
    ar: "الأمن السيبراني",
  },
  "javascript-typescript": {
    fr: "JavaScript & TypeScript",
    en: "JavaScript & TypeScript",
    ar: "JavaScript و TypeScript",
  },
  "react-nextjs": {
    fr: "React & Next.js",
    en: "React & Next.js",
    ar: "React و Next.js",
  },
  "business-digital": {
    fr: "Business & Digital",
    en: "Business & Digital",
    ar: "الأعمال والتحول الرقمي",
  },
  freelancing: {
    fr: "Freelance & Clients",
    en: "Freelancing & Clients",
    ar: "العمل الحر واكتساب العملاء",
  },
  woocommerce: { fr: "WooCommerce", en: "WooCommerce", ar: "WooCommerce" },
};

function article(
  slug: string,
  category: string,
  tags: string[],
  daysAgo: number,
  titles: BlogArticleSeed["titles"],
  topicFr: string,
  topicEn: string,
  topicAr: string,
  featured = false
): BlogArticleSeed {
  return {
    slug,
    category,
    tags,
    featured,
    daysAgo,
    titles,
    excerpts: {
      fr: `Guide professionnel D-GITALCODE sur ${topicFr} : stratégies, bonnes pratiques et conseils d'agence pour accélérer vos projets digitaux.`,
      en: `Professional D-GITALCODE guide on ${topicEn}: agency strategies, best practices, and actionable insights for digital projects.`,
      ar: `دليل احترافي من D-GITALCODE حول ${topicAr}: استراتيجيات وممارسات عملية لتسريع مشاريعك الرقمية.`,
    },
    keywords: tags,
    sections: {
      fr: [
        `Pourquoi ${topicFr} est stratégique en 2026`,
        `Erreurs fréquentes à éviter`,
        `Framework d'implémentation D-GITALCODE`,
        `Checklist opérationnelle`,
        `Comment mesurer le ROI`,
        `Prochaines étapes avec une agence`,
      ],
      en: [
        `Why ${topicEn} matters in 2026`,
        `Common mistakes to avoid`,
        `D-GITALCODE implementation framework`,
        `Operational checklist`,
        `How to measure ROI`,
        `Next steps with an agency partner`,
      ],
      ar: [
        `لماذا ${topicAr} مهم في 2026`,
        `أخطاء شائعة يجب تجنبها`,
        `إطار تنفيذ D-GITALCODE`,
        `قائمة تحقق عملية`,
        `كيفية قياس العائد`,
        `الخطوات التالية مع شريك تقني`,
      ],
    },
  };
}

export const BLOG_ARTICLES: BlogArticleSeed[] = [
  article("nextjs-vs-traditional-cms-2026", "web-development", ["Next.js", "CMS", "Architecture"], 2, { fr: "Next.js vs CMS traditionnels en 2026", en: "Next.js vs Traditional CMS in 2026", ar: "Next.js مقابل أنظمة CMS التقليدية 2026" }, "Next.js face aux CMS traditionnels", "Next.js vs traditional CMS", "Next.js مقابل CMS التقليدية", true),
  article("headless-commerce-architecture-guide", "web-development", ["Headless", "eCommerce", "API"], 3, { fr: "Architecture headless commerce : guide complet", en: "Headless Commerce Architecture Guide", ar: "دليل بنية التجارة بدون واجهة" }, "l'architecture headless commerce", "headless commerce architecture", "بنية headless commerce"),
  article("web-performance-core-vitals-checklist", "web-development", ["Performance", "Core Web Vitals", "SEO"], 4, { fr: "Checklist Core Web Vitals pour sites performants", en: "Core Web Vitals Checklist for Fast Websites", ar: "قائمة Core Web Vitals للمواقع السريعة" }, "les Core Web Vitals", "Core Web Vitals", "Core Web Vitals"),
  article("api-first-web-development-strategy", "web-development", ["API", "Architecture", "Scalability"], 5, { fr: "Stratégie API-first pour projets web scalables", en: "API-First Web Development Strategy", ar: "استراتيجية API-first للمشاريع القابلة للتوسع" }, "l'approche API-first", "API-first development", "تطوير API-first"),
  article("choosing-tech-stack-startup-website", "web-development", ["Tech Stack", "Startup", "Strategy"], 6, { fr: "Choisir la stack technique d'un site startup", en: "Choosing a Tech Stack for Startup Websites", ar: "اختيار التقنية المناسبة لموقع الشركات الناشئة" }, "le choix de stack technique", "tech stack selection", "اختيار التقنية"),

  article("flutter-vs-react-native-2026", "mobile-apps", ["Flutter", "React Native", "Mobile"], 7, { fr: "Flutter vs React Native en 2026", en: "Flutter vs React Native in 2026", ar: "Flutter مقابل React Native 2026" }, "Flutter vs React Native", "Flutter vs React Native", "Flutter و React Native", true),
  article("mobile-app-mvp-launch-checklist", "mobile-apps", ["MVP", "Mobile", "Launch"], 8, { fr: "Checklist de lancement MVP mobile", en: "Mobile App MVP Launch Checklist", ar: "قائمة إطلاق MVP للتطبيقات" }, "le lancement MVP mobile", "mobile MVP launch", "إطلاق MVP للجوال"),
  article("app-store-optimization-basics", "mobile-apps", ["ASO", "App Store", "Mobile"], 9, { fr: "ASO : optimiser la visibilité App Store", en: "App Store Optimization Basics", ar: "أساسيات تحسين متجر التطبيقات" }, "l'ASO mobile", "app store optimization", "تحسين متجر التطبيقات"),
  article("offline-first-mobile-architecture", "mobile-apps", ["Offline", "Mobile", "Architecture"], 10, { fr: "Architecture offline-first pour apps mobiles", en: "Offline-First Mobile Architecture", ar: "بنية offline-first للتطبيقات" }, "l'architecture offline-first", "offline-first architecture", "بنية offline-first"),
  article("push-notifications-mobile-retention", "mobile-apps", ["Push", "Retention", "Mobile"], 11, { fr: "Notifications push et rétention mobile", en: "Push Notifications and Mobile Retention", ar: "الإشعارات والاحتفاظ بالمستخدمين" }, "les notifications push", "push notifications", "الإشعارات الفورية"),

  article("saas-dashboard-ux-patterns", "ui-ux", ["UX", "SaaS", "Dashboard"], 12, { fr: "Patterns UX pour dashboards SaaS", en: "SaaS Dashboard UX Patterns", ar: "أنماط UX للوحات SaaS" }, "les dashboards SaaS", "SaaS dashboard UX", "تجربة لوحات SaaS"),
  article("design-systems-scale-products", "ui-ux", ["Design System", "UI", "Scale"], 13, { fr: "Design systems pour produits scalables", en: "Design Systems That Scale Products", ar: "أنظمة التصميم للمنتجات القابلة للتوسع" }, "les design systems", "design systems", "أنظمة التصميم"),
  article("conversion-focused-landing-pages", "ui-ux", ["Conversion", "Landing Page", "UX"], 14, { fr: "Landing pages orientées conversion", en: "Conversion-Focused Landing Pages", ar: "صفحات هبوط موجهة للتحويل" }, "les landing pages conversion", "conversion landing pages", "صفحات الهبوط"),
  article("accessibility-wcag-product-teams", "ui-ux", ["Accessibility", "WCAG", "UX"], 15, { fr: "Accessibilité WCAG pour équipes produit", en: "WCAG Accessibility for Product Teams", ar: "إمكانية الوصول WCAG للفرق" }, "l'accessibilité WCAG", "WCAG accessibility", "إمكانية الوصول"),
  article("micro-interactions-ux-impact", "ui-ux", ["Micro-interactions", "UX", "Design"], 16, { fr: "Micro-interactions et impact UX", en: "Micro-interactions UX Impact", ar: "التفاعلات الدقيقة وتأثير UX" }, "les micro-interactions", "micro-interactions", "التفاعلات الدقيقة"),

  article("build-saas-mvp-90-days", "saas", ["SaaS", "MVP", "Startup"], 17, { fr: "Construire un SaaS MVP en 90 jours", en: "Build a SaaS MVP in 90 Days", ar: "بناء SaaS MVP في 90 يوماً" }, "un SaaS MVP en 90 jours", "SaaS MVP in 90 days", "SaaS MVP في 90 يوماً", true),
  article("subscription-billing-stripe-architecture", "saas", ["Stripe", "Billing", "SaaS"], 18, { fr: "Architecture facturation Stripe pour SaaS", en: "Stripe Subscription Billing Architecture", ar: "بنية الفوترة عبر Stripe" }, "la facturation Stripe SaaS", "Stripe billing architecture", "فوترة Stripe"),
  article("multi-tenant-saas-database-design", "saas", ["Multi-tenant", "Database", "SaaS"], 19, { fr: "Design base de données multi-tenant SaaS", en: "Multi-Tenant SaaS Database Design", ar: "تصميم قاعدة بيانات multi-tenant" }, "le multi-tenant SaaS", "multi-tenant database design", "قواعد multi-tenant"),
  article("saas-onboarding-reduce-churn", "saas", ["Onboarding", "Churn", "SaaS"], 20, { fr: "Onboarding SaaS pour réduire le churn", en: "SaaS Onboarding to Reduce Churn", ar: "تهيئة SaaS لتقليل التسرب" }, "l'onboarding SaaS", "SaaS onboarding", "تهيئة SaaS"),
  article("saas-pricing-models-guide", "saas", ["Pricing", "SaaS", "Business"], 21, { fr: "Modèles de pricing SaaS : guide complet", en: "SaaS Pricing Models Guide", ar: "دليل نماذج تسعير SaaS" }, "le pricing SaaS", "SaaS pricing models", "تسعير SaaS"),

  article("technical-seo-nextjs-checklist", "seo", ["SEO", "Next.js", "Technical"], 22, { fr: "SEO technique Next.js : checklist 2026", en: "Technical SEO Next.js Checklist", ar: "قائمة SEO التقني لـ Next.js" }, "le SEO technique Next.js", "technical SEO Next.js", "SEO التقني Next.js"),
  article("content-cluster-strategy-agencies", "seo", ["Content", "SEO", "Strategy"], 23, { fr: "Stratégie de clusters de contenu SEO", en: "Content Cluster Strategy for Agencies", ar: "استراتيجية مجموعات المحتوى" }, "les content clusters SEO", "content cluster strategy", "مجموعات المحتوى"),
  article("local-seo-morocco-businesses", "seo", ["Local SEO", "Morocco", "Business"], 24, { fr: "SEO local pour entreprises au Maroc", en: "Local SEO for Morocco Businesses", ar: "SEO المحلي للشركات في المغرب" }, "le SEO local Maroc", "local SEO Morocco", "SEO المحلي المغرب"),
  article("seo-audit-framework-2026", "seo", ["SEO Audit", "Framework", "Agency"], 25, { fr: "Framework d'audit SEO professionnel", en: "Professional SEO Audit Framework", ar: "إطار تدقيق SEO احترافي" }, "l'audit SEO", "SEO audit framework", "تدقيق SEO"),
  article("structured-data-rich-results", "seo", ["Schema", "SEO", "Rich Results"], 26, { fr: "Données structurées et rich results Google", en: "Structured Data and Rich Results", ar: "البيانات المنظمة ونتائج غنية" }, "les données structurées", "structured data", "البيانات المنظمة"),

  article("web-app-security-owasp-basics", "cybersecurity", ["OWASP", "Security", "Web"], 27, { fr: "Sécurité web : bases OWASP", en: "Web App Security OWASP Basics", ar: "أساسيات أمان الويب OWASP" }, "la sécurité OWASP", "OWASP security basics", "أمان OWASP"),
  article("authentication-jwt-vs-sessions", "cybersecurity", ["JWT", "Auth", "Security"], 28, { fr: "JWT vs sessions : quel choix d'authentification", en: "JWT vs Sessions Authentication", ar: "JWT مقابل الجلسات للمصادقة" }, "JWT vs sessions", "JWT vs sessions", "JWT والجلسات"),
  article("secure-api-design-practices", "cybersecurity", ["API", "Security", "Backend"], 29, { fr: "Bonnes pratiques de sécurisation API", en: "Secure API Design Practices", ar: "ممارسات تأمين API" }, "la sécurité API", "secure API design", "تأمين API"),
  article("gdpr-compliance-web-projects", "cybersecurity", ["GDPR", "Compliance", "Privacy"], 30, { fr: "Conformité RGPD pour projets web", en: "GDPR Compliance for Web Projects", ar: "الامتثال GDPR للمشاريع" }, "la conformité RGPD", "GDPR compliance", "الامتثال GDPR"),
  article("ssl-https-deployment-guide", "cybersecurity", ["HTTPS", "SSL", "DevOps"], 31, { fr: "Guide déploiement HTTPS/SSL en production", en: "SSL HTTPS Deployment Guide", ar: "دليل نشر HTTPS/SSL" }, "le déploiement HTTPS", "HTTPS deployment", "نشر HTTPS"),

  article("typescript-best-practices-2026", "javascript-typescript", ["TypeScript", "Best Practices", "JavaScript"], 32, { fr: "TypeScript : bonnes pratiques 2026", en: "TypeScript Best Practices 2026", ar: "أفضل ممارسات TypeScript 2026" }, "TypeScript en production", "TypeScript best practices", "TypeScript"),
  article("javascript-performance-patterns", "javascript-typescript", ["JavaScript", "Performance", "Patterns"], 33, { fr: "Patterns de performance JavaScript", en: "JavaScript Performance Patterns", ar: "أنماط أداء JavaScript" }, "la performance JavaScript", "JavaScript performance", "أداء JavaScript"),
  article("nodejs-production-deployment", "javascript-typescript", ["Node.js", "DevOps", "Production"], 34, { fr: "Déployer Node.js en production", en: "Node.js Production Deployment", ar: "نشر Node.js في الإنتاج" }, "Node.js en production", "Node.js deployment", "نشر Node.js"),
  article("esm-vs-commonjs-modern-node", "javascript-typescript", ["ESM", "Node.js", "Modules"], 35, { fr: "ESM vs CommonJS dans Node moderne", en: "ESM vs CommonJS in Modern Node", ar: "ESM مقابل CommonJS" }, "ESM vs CommonJS", "ESM vs CommonJS", "ESM و CommonJS"),
  article("testing-strategies-typescript-apps", "javascript-typescript", ["Testing", "TypeScript", "QA"], 36, { fr: "Stratégies de tests pour apps TypeScript", en: "Testing Strategies for TypeScript Apps", ar: "استراتيجيات اختبار TypeScript" }, "les tests TypeScript", "TypeScript testing", "اختبار TypeScript"),

  article("nextjs-app-router-patterns", "react-nextjs", ["Next.js", "App Router", "React"], 37, { fr: "Patterns Next.js App Router", en: "Next.js App Router Patterns", ar: "أنماط Next.js App Router" }, "Next.js App Router", "Next.js App Router", "Next.js App Router", true),
  article("react-server-components-explained", "react-nextjs", ["RSC", "React", "Next.js"], 38, { fr: "React Server Components expliqués", en: "React Server Components Explained", ar: "شرح React Server Components" }, "les React Server Components", "React Server Components", "RSC"),
  article("state-management-react-2026", "react-nextjs", ["React", "State", "Architecture"], 39, { fr: "Gestion d'état React en 2026", en: "React State Management in 2026", ar: "إدارة الحالة في React 2026" }, "la gestion d'état React", "React state management", "إدارة الحالة React"),
  article("nextjs-seo-metadata-api", "react-nextjs", ["Next.js", "SEO", "Metadata"], 40, { fr: "SEO avec l'API Metadata Next.js", en: "Next.js SEO Metadata API Guide", ar: "SEO عبر Metadata API" }, "l'API Metadata Next.js", "Next.js metadata API", "Metadata API"),
  article("react-performance-optimization", "react-nextjs", ["React", "Performance", "Optimization"], 41, { fr: "Optimiser les performances React", en: "React Performance Optimization", ar: "تحسين أداء React" }, "la performance React", "React performance", "أداء React"),

  article("digital-transformation-smes-morocco", "business-digital", ["Digital Transformation", "SME", "Morocco"], 42, { fr: "Transformation digitale des PME au Maroc", en: "Digital Transformation for SMEs in Morocco", ar: "التحول الرقمي للشركات الصغيرة" }, "la transformation digitale PME", "digital transformation SMEs", "التحول الرقمي"),
  article("roi-measuring-web-projects", "business-digital", ["ROI", "Web", "Business"], 43, { fr: "Mesurer le ROI d'un projet web", en: "Measuring ROI of Web Projects", ar: "قياس عائد مشاريع الويب" }, "le ROI des projets web", "web project ROI", "عائد مشاريع الويب"),
  article("ecommerce-growth-strategy-2026", "business-digital", ["eCommerce", "Growth", "Strategy"], 44, { fr: "Stratégie de croissance eCommerce 2026", en: "eCommerce Growth Strategy 2026", ar: "استراتيجية نمو التجارة الإلكترونية" }, "la croissance eCommerce", "eCommerce growth", "نمو التجارة الإلكترونية"),
  article("crm-integration-sales-pipelines", "business-digital", ["CRM", "Sales", "Integration"], 45, { fr: "Intégration CRM et pipelines commerciaux", en: "CRM Integration and Sales Pipelines", ar: "تكامل CRM ومسارات المبيعات" }, "l'intégration CRM", "CRM integration", "تكامل CRM"),
  article("automation-workflows-business", "business-digital", ["Automation", "Workflow", "Business"], 46, { fr: "Automatisation des workflows business", en: "Business Workflow Automation", ar: "أتمتة سير العمل" }, "l'automatisation business", "workflow automation", "أتمتة الأعمال"),

  article("win-high-value-dev-clients", "freelancing", ["Freelance", "Clients", "Sales"], 47, { fr: "Gagner des clients dev à forte valeur", en: "Win High-Value Development Clients", ar: "كسب عملاء تطوير عالي القيمة" }, "l'acquisition clients premium", "winning dev clients", "اكتساب العملاء"),
  article("freelance-proposal-templates-work", "freelancing", ["Freelance", "Proposal", "Templates"], 48, { fr: "Propositions freelance qui convertissent", en: "Freelance Proposal Templates That Work", ar: "عروض العمل الحر الفعالة" }, "les propositions freelance", "freelance proposals", "عروض العمل الحر"),
  article("pricing-freelance-web-projects", "freelancing", ["Pricing", "Freelance", "Web"], 49, { fr: "Tarifer un projet web en freelance", en: "Pricing Freelance Web Projects", ar: "تسعير مشاريع الويب" }, "le pricing freelance", "freelance pricing", "تسعير المشاريع"),
  article("portfolio-case-studies-convert", "freelancing", ["Portfolio", "Case Study", "Conversion"], 50, { fr: "Portfolio et case studies qui convertissent", en: "Portfolio Case Studies That Convert", ar: "محفظة أعمال تحوّل الزوار" }, "un portfolio qui convertit", "portfolio case studies", "محفظة الأعمال"),
  article("agency-vs-freelancer-hiring-guide", "freelancing", ["Agency", "Freelance", "Hiring"], 51, { fr: "Agence vs freelance : guide d'embauche 2026", en: "Agency vs Freelancer Hiring Guide 2026", ar: "وكالة مقابل مستقل: دليل التوظيف 2026" }, "le choix agence vs freelance", "agency vs freelancer hiring", "الوكالة مقابل المستقل"),
];

export const BLOG_ARTICLE_COUNT = BLOG_ARTICLES.length;
