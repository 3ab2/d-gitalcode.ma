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
    update: {
      gallery: [],
      translations: {
        deleteMany: {},
        create: [
          {
            locale: "fr",
            title: "WhatsFlow Demo Store",
            description:
              "Boutique WooCommerce de démonstration avec WhatsFlow Pro intégré.",
            overview:
              "Une boutique eCommerce complète démontrant l'intégration WhatsFlow Pro — conversion WhatsApp, routage multi-agents et analytics en temps réel.",
            challenge:
              "Les boutiques WooCommerce perdent des ventes faute d'un canal de contact instantané adapté au marché marocain et MENA.",
            solution:
              "Intégration complète de WhatsFlow Pro avec boutons produit, popup sélecteur d'agent, messages pré-remplis et dashboard analytics.",
            features: [
              "Bouton WhatsApp par produit",
              "Multi-Agent Routing",
              "Popup Agent Selector",
              "Click Tracking & Analytics",
              "Export CSV",
            ],
            results:
              "Augmentation mesurable des clics WhatsApp et du taux de contact client sur la boutique demo.",
            outcome:
              "Une vitrine eCommerce crédible qui convertit les visiteurs en conversations commerciales qualifiées.",
            client: "D-GITALCODE",
          },
          {
            locale: "en",
            title: "WhatsFlow Demo Store",
            description: "WooCommerce demo store with WhatsFlow Pro integrated.",
            overview:
              "A full eCommerce storefront showcasing WhatsFlow Pro — WhatsApp conversion, multi-agent routing and real-time analytics.",
            challenge:
              "WooCommerce stores lose sales without an instant contact channel suited to Moroccan and MENA markets.",
            solution:
              "Full WhatsFlow Pro integration with product buttons, agent selector popup, pre-filled messages and analytics dashboard.",
            features: [
              "Per-product WhatsApp button",
              "Multi-Agent Routing",
              "Agent Selector Popup",
              "Click Tracking & Analytics",
              "CSV Export",
            ],
            results:
              "Measurable increase in WhatsApp clicks and qualified client conversations on the demo store.",
            outcome:
              "A credible eCommerce showcase that converts visitors into qualified sales conversations.",
            client: "D-GITALCODE",
          },
          {
            locale: "ar",
            title: "متجر WhatsFlow التجريبي",
            description: "متجر WooCommerce تجريبي مع WhatsFlow Pro مدمج.",
            overview: "متجر تجارة إلكترونية يعرض WhatsFlow Pro — تحويل WhatsApp وتوجيه متعدد الوكلاء.",
            challenge: "متاجر WooCommerce تفقد مبيعات بدون قناة اتصال فورية.",
            solution: "تكامل WhatsFlow Pro كامل مع أزرار المنتجات ولوحة analytics.",
            features: ["زر WhatsApp لكل منتج", "توجيه Multi-Agent", "تتبع النقرات", "تصدير CSV"],
            results: "زيادة قابلة للقياس في نقرات WhatsApp.",
            outcome: "واجهة eCommerce مقنعة تحوّل الزوار إلى محادثات مبيعات.",
            client: "D-GITALCODE",
          },
        ],
      },
    },
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
              "Boutique WooCommerce de démonstration avec WhatsFlow Pro intégré.",
            overview:
              "Une boutique eCommerce complète démontrant WhatsFlow Pro.",
            challenge: "Perte de ventes sans canal WhatsApp instantané.",
            solution: "Intégration WhatsFlow Pro complète.",
            features: ["Multi-Agent Routing", "Analytics", "Popup Selector"],
            results: "Plus de clics WhatsApp qualifiés.",
            outcome: "Vitrine eCommerce crédible et convertissante.",
            client: "D-GITALCODE",
          },
          {
            locale: "en",
            title: "WhatsFlow Demo Store",
            description: "WooCommerce demo store with WhatsFlow Pro.",
            overview: "Full eCommerce showcase for WhatsFlow Pro.",
            challenge: "Lost sales without instant WhatsApp channel.",
            solution: "Full WhatsFlow Pro integration.",
            features: ["Multi-Agent Routing", "Analytics", "Popup Selector"],
            results: "More qualified WhatsApp conversations.",
            outcome: "Credible converting eCommerce showcase.",
            client: "D-GITALCODE",
          },
          {
            locale: "ar",
            title: "متجر WhatsFlow التجريبي",
            description: "متجر WooCommerce تجريبي.",
            overview: "عرض eCommerce لـ WhatsFlow Pro.",
            challenge: "فقدان مبيعات بدون WhatsApp.",
            solution: "تكامل WhatsFlow Pro.",
            features: ["توجيه الوكلاء", "Analytics"],
            results: "زيادة النقرات.",
            outcome: "واجهة مقنعة.",
            client: "D-GITALCODE",
          },
        ],
      },
    },
  });

  const category = await prisma.blogCategory.upsert({
    where: { slug: "woocommerce" },
    update: {},
    create: {
      slug: "woocommerce",
      translations: {
        create: [
          { locale: "fr", name: "WooCommerce" },
          { locale: "en", name: "WooCommerce" },
          { locale: "ar", name: "WooCommerce" },
        ],
      },
    },
  });

  const blogPost = await prisma.blogPost.upsert({
    where: { slug: "whatsapp-woocommerce-conversions" },
    update: {},
    create: {
      slug: "whatsapp-woocommerce-conversions",
      published: true,
      featured: true,
      publishedAt: new Date(),
      translations: {
        create: [
          {
            locale: "fr",
            title: "Comment WhatsApp booste les conversions WooCommerce",
            excerpt:
              "Découvrez comment intégrer WhatsApp dans votre boutique en ligne pour augmenter vos ventes.",
            content: `<p>WhatsApp est devenu le canal de communication préféré des consommateurs marocains et internationaux. Pour les boutiques WooCommerce, c'est une opportunité en or.</p>
<h2>Pourquoi WhatsApp ?</h2>
<p>Le taux d'ouverture des messages WhatsApp dépasse 90%, contre 20% pour l'email. Chaque clic sur un bouton WhatsApp est une conversation commerciale potentielle.</p>
<h2>WhatsFlow Pro</h2>
<p>Notre plugin WhatsFlow Pro permet d'ajouter des boutons WhatsApp intelligents à chaque produit, avec routage multi-agents et analytics intégrés.</p>
<ul>
<li>Multi-Agent Routing (Round Robin, Random, Sticky)</li>
<li>Messages pré-remplis personnalisés</li>
<li>Dashboard analytics avec export CSV</li>
</ul>
<p><a href="https://whatsflow-demo.fwh.is">Testez la démo live</a></p>`,
            metaTitle: "WhatsApp & WooCommerce : Guide conversions | D-GITALCODE",
            metaDescription:
              "Comment utiliser WhatsApp pour booster les conversions de votre boutique WooCommerce.",
          },
          {
            locale: "en",
            title: "How WhatsApp Boosts WooCommerce Conversions",
            excerpt:
              "Learn how to integrate WhatsApp in your online store to increase sales.",
            content: `<p>WhatsApp has become the preferred communication channel for consumers. For WooCommerce stores, it's a golden opportunity.</p>
<h2>Why WhatsApp?</h2>
<p>WhatsApp message open rates exceed 90%, compared to 20% for email.</p>
<h2>WhatsFlow Pro</h2>
<p>Our WhatsFlow Pro plugin adds smart WhatsApp buttons to each product with multi-agent routing and built-in analytics.</p>`,
            metaTitle: "WhatsApp & WooCommerce: Conversion Guide | D-GITALCODE",
            metaDescription: "How to use WhatsApp to boost your WooCommerce store conversions.",
          },
          {
            locale: "ar",
            title: "كيف يعزز واتساب تحويلات WooCommerce",
            excerpt: "تعلم كيفية دمج واتساب في متجرك لزيادة المبيعات.",
            content: `<p>أصبح واتساب القناة المفضلة للتواصل مع العملاء. لمتاجر WooCommerce، هذه فرصة ذهبية.</p>
<h2>لماذا واتساب؟</h2>
<p>معدل فتح رسائل واتساب يتجاوز 90%.</p>
<h2>WhatsFlow Pro</h2>
<p>إضافتنا WhatsFlow Pro تضيف أزرار واتساب ذكية لكل منتج.</p>`,
            metaTitle: "واتساب و WooCommerce: دليل التحويل | D-GITALCODE",
            metaDescription: "كيفية استخدام واتساب لتعزيز تحويلات متجر WooCommerce.",
          },
        ],
      },
      categories: {
        create: [{ categoryId: category.id }],
      },
    },
  });

  const tags = ["WhatsApp", "WooCommerce", "eCommerce"];
  for (const name of tags) {
    const slug = name.toLowerCase();
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      update: {},
      create: { slug, name },
    });
    await prisma.blogPostTag.upsert({
      where: { postId_tagId: { postId: blogPost.id, tagId: tag.id } },
      update: {},
      create: { postId: blogPost.id, tagId: tag.id },
    });
  }

  const siteSettingsSeed = [
    { key: "contact_email", value: DEFAULT_CONTACT_EMAIL },
    { key: "whatsapp_number", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212706984671" },
    { key: "phone", value: "+212 706-984671" },
    { key: "address", value: "Casablanca, Maroc" },
    {
      key: "seo_title",
      value: "D-GITALCODE — Agence Digitale & Solutions WooCommerce",
    },
    {
      key: "seo_description",
      value:
        "Agence digitale spécialisée en développement web, applications mobiles, plugins WooCommerce et solutions eCommerce intelligentes.",
    },
    {
      key: "seo_keywords",
      value:
        "développement web, WooCommerce, WhatsApp, WordPress plugins, agence digitale Maroc",
    },
    { key: "default_currency", value: "MAD" },
  ];

  for (const setting of siteSettingsSeed) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

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
