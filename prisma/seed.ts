import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_CONTACT_EMAIL = "3ab2uelkarch2006@gmail.com";
const LEGACY_ADMIN_EMAIL = "admin@d-gitalcode.ma";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || DEFAULT_CONTACT_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  if (adminEmail !== LEGACY_ADMIN_EMAIL) {
    const legacyAdmin = await prisma.user.findUnique({
      where: { email: LEGACY_ADMIN_EMAIL },
    });
    if (legacyAdmin) {
      await prisma.user.update({
        where: { email: LEGACY_ADMIN_EMAIL },
        data: { email: adminEmail },
      });
    }
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin D-GITALCODE",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const stats = [
    { key: "projects", value: "50+", label: "Projets livrés" },
    { key: "clients", value: "30+", label: "Clients satisfaits" },
    { key: "plugins", value: "5+", label: "Plugins vendus" },
    { key: "experience", value: "8+", label: "Années d'expérience" },
  ];

  for (const stat of stats) {
    await prisma.siteStat.upsert({
      where: { key: stat.key },
      update: { value: stat.value },
      create: stat,
    });
  }

  const whatsflowPro = await prisma.service.upsert({
    where: { slug: "whatsflow-pro" },
    update: {},
    create: {
      slug: "whatsflow-pro",
      type: "WORDPRESS_PLUGINS",
      price: 49,
      priceLabel: "À partir de $49",
      featured: true,
      published: true,
      demoUrl: "https://whatsflow-demo.fwh.is",
      order: 1,
      translations: {
        create: [
          {
            locale: "fr",
            title: "WhatsFlow Pro",
            shortDesc:
              "Plugin WooCommerce professionnel pour ajouter WhatsApp à vos produits avec routage multi-agents.",
            description:
              "WhatsFlow Pro transforme votre boutique WooCommerce en machine de vente WhatsApp. Ajoutez des boutons WhatsApp aux produits, routez les clients vers différents agents (Round Robin, Random, Sticky), suivez les clics et exportez des rapports CSV.",
            features: [
              "Bouton WhatsApp par produit",
              "Multi-Agent Routing",
              "Popup Agent Selector",
              "Messages pré-remplis",
              "Click Tracking & Analytics",
              "Export CSV",
              "Mobile optimized",
              "Sans WhatsApp API",
            ],
          },
          {
            locale: "en",
            title: "WhatsFlow Pro",
            shortDesc:
              "Professional WooCommerce plugin to add WhatsApp to products with multi-agent routing.",
            description:
              "WhatsFlow Pro transforms your WooCommerce store into a WhatsApp sales machine. Add WhatsApp buttons to products, route customers to different agents, track clicks and export CSV reports.",
            features: [
              "WhatsApp button per product",
              "Multi-Agent Routing",
              "Popup Agent Selector",
              "Pre-filled messages",
              "Click Tracking & Analytics",
              "CSV Export",
              "Mobile optimized",
              "No WhatsApp API required",
            ],
          },
          {
            locale: "ar",
            title: "WhatsFlow Pro",
            shortDesc:
              "إضافة WooCommerce احترافية لإضافة واتساب للمنتجات مع توجيه متعدد الوكلاء.",
            description:
              "WhatsFlow Pro يحول متجر WooCommerce إلى آلة مبيعات عبر واتساب. أضف أزرار واتساب للمنتجات، وجّه العملاء لوكلاء مختلفين، وتتبع النقرات وصدّر تقارير CSV.",
            features: [
              "زر واتساب لكل منتج",
              "توجيه متعدد الوكلاء",
              "نافذة اختيار الوكيل",
              "رسائل مسبقة التعبئة",
              "تتبع النقرات والتحليلات",
              "تصدير CSV",
              "محسّن للجوال",
              "بدون WhatsApp API",
            ],
          },
        ],
      },
    },
  });

  const services = [
    {
      slug: "site-web-vitrine",
      type: "WEB_DEVELOPMENT" as const,
      price: 5000,
      order: 1,
      translations: {
        fr: {
          title: "Site Web Vitrine",
          shortDesc: "Site web professionnel moderne et responsive.",
          description:
            "Création de sites web vitrine modernes, rapides et optimisés SEO. Design sur mesure, responsive et performant.",
          features: ["Design moderne", "SEO optimisé", "Responsive", "Performance 90+"],
        },
        en: {
          title: "Showcase Website",
          shortDesc: "Modern and responsive professional website.",
          description:
            "Creation of modern, fast and SEO-optimized showcase websites. Custom design, responsive and high-performance.",
          features: ["Modern design", "SEO optimized", "Responsive", "90+ Performance"],
        },
        ar: {
          title: "موقع تعريفي",
          shortDesc: "موقع احترافي حديث ومتجاوب.",
          description: "إنشاء مواقع تعريفية حديثة وسريعة ومحسّنة لمحركات البحث.",
          features: ["تصميم حديث", "SEO", "متجاوب", "أداء عالي"],
        },
      },
    },
    {
      slug: "app-mobile",
      type: "MOBILE_APPS" as const,
      price: 15000,
      order: 1,
      translations: {
        fr: {
          title: "Application Mobile",
          shortDesc: "App iOS & Android native ou cross-platform.",
          description:
            "Développement d'applications mobiles iOS et Android avec React Native ou Flutter.",
          features: ["iOS & Android", "UI/UX premium", "API integration", "Push notifications"],
        },
        en: {
          title: "Mobile Application",
          shortDesc: "Native or cross-platform iOS & Android app.",
          description: "Mobile app development for iOS and Android with React Native or Flutter.",
          features: ["iOS & Android", "Premium UI/UX", "API integration", "Push notifications"],
        },
        ar: {
          title: "تطبيق جوال",
          shortDesc: "تطبيق iOS و Android أصلي أو متعدد المنصات.",
          description: "تطوير تطبيقات جوال لـ iOS و Android.",
          features: ["iOS و Android", "واجهة متميزة", "تكامل API", "إشعارات"],
        },
      },
    },
    {
      slug: "theme-woocommerce",
      type: "WORDPRESS_TEMPLATES" as const,
      price: 79,
      priceLabel: "À partir de $79",
      order: 1,
      translations: {
        fr: {
          title: "Thème WooCommerce Premium",
          shortDesc: "Thème eCommerce optimisé conversion.",
          description: "Thème WordPress/WooCommerce premium optimisé pour la conversion et le SEO.",
          features: ["Conversion optimisée", "Mobile first", "SEO ready", "Support inclus"],
        },
        en: {
          title: "Premium WooCommerce Theme",
          shortDesc: "Conversion-optimized eCommerce theme.",
          description: "Premium WordPress/WooCommerce theme optimized for conversion and SEO.",
          features: ["Conversion optimized", "Mobile first", "SEO ready", "Support included"],
        },
        ar: {
          title: "قالب WooCommerce متميز",
          shortDesc: "قالب تجارة إلكترونية محسّن للتحويل.",
          description: "قالب WordPress/WooCommerce متميز محسّن للتحويل وSEO.",
          features: ["تحويل محسّن", "جوال أولاً", "SEO", "دعم"],
        },
      },
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: {
        slug: svc.slug,
        type: svc.type,
        price: svc.price,
        priceLabel: (svc as { priceLabel?: string }).priceLabel,
        featured: false,
        published: true,
        order: svc.order,
        translations: {
          create: (["fr", "en", "ar"] as const).map((locale) => ({
            locale,
            ...svc.translations[locale],
          })),
        },
      },
    });
  }

  await prisma.portfolioProject.upsert({
    where: { slug: "whatsflow-demo-store" },
    update: {},
    create: {
      slug: "whatsflow-demo-store",
      url: "https://whatsflow-demo.fwh.is",
      technologies: ["WordPress", "WooCommerce", "WhatsFlow Pro", "PHP"],
      featured: true,
      published: true,
      order: 1,
      translations: {
        create: [
          {
            locale: "fr",
            title: "WhatsFlow Demo Store",
            description:
              "Boutique WooCommerce de démonstration avec WhatsFlow Pro intégré. Multi-agent routing, analytics et popup selector.",
            client: "D-GITALCODE",
          },
          {
            locale: "en",
            title: "WhatsFlow Demo Store",
            description:
              "WooCommerce demo store with WhatsFlow Pro integrated. Multi-agent routing, analytics and popup selector.",
            client: "D-GITALCODE",
          },
          {
            locale: "ar",
            title: "متجر WhatsFlow التجريبي",
            description: "متجر WooCommerce تجريبي مع WhatsFlow Pro مدمج.",
            client: "D-GITALCODE",
          },
        ],
      },
    },
  });

  const socialLinksSeed = [
    { platform: "instagram", url: "https://www.instagram.com/digitalcode.ma/", label: "Instagram", order: 0 },
    { platform: "linkedin", url: "https://www.linkedin.com/in/d-gitalcode-elkarch-abdelhamid-0604583bb/", label: "LinkedIn", order: 1 },
    { platform: "github", url: "https://github.com/3ab2", label: "GitHub", order: 2 },
    { platform: "kofi", url: "https://ko-fi.com/d_igitalcode", label: "Ko-fi", order: 3 },
  ];

  for (const link of socialLinksSeed) {
    await prisma.socialLink.upsert({
      where: { platform: link.platform },
      update: { url: link.url, label: link.label, order: link.order },
      create: { ...link, enabled: true },
    });
  }

  console.log("Seed completed successfully!");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log(`WhatsFlow Pro service ID: ${whatsflowPro.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
