import { PrismaClient } from "@prisma/client";
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  type BlogArticleSeed,
} from "./data/blog-articles";
import { getBlogImage } from "../src/lib/blog-images";

const prisma = new PrismaClient();

const AUTHOR = "D-GITALCODE";

function buildContent(
  article: BlogArticleSeed,
  locale: "fr" | "en" | "ar"
): string {
  const title = article.titles[locale];
  const sections = article.sections[locale];
  const intro =
    locale === "fr"
      ? `<p>Chez <strong>${AUTHOR}</strong>, nous accompagnons les entreprises ambitieuses avec une approche technique, orientée business et mesurable. Ce guide détaille les fondamentaux, les pièges à éviter et un plan d'action concret.</p>`
      : locale === "en"
        ? `<p>At <strong>${AUTHOR}</strong>, we help ambitious businesses with a technical, business-oriented, and measurable approach. This guide covers fundamentals, pitfalls, and a concrete action plan.</p>`
        : `<p>في <strong>${AUTHOR}</strong>، نساعد الشركات الطموحة بمنهجية تقنية موجهة للأعمال وقابلة للقياس. يغطي هذا الدليل الأساسيات والأخطاء وخطة عمل واضحة.</p>`;

  const body = sections
    .map((heading, i) => {
      const p =
        locale === "fr"
          ? `<p>Point clé ${i + 1} : appliquez cette section avec des objectifs mesurables, des livrables clairs et une priorisation ROI. Notre équipe recommande des itérations courtes et des revues techniques régulières.</p>`
          : locale === "en"
            ? `<p>Key point ${i + 1}: implement this section with measurable goals, clear deliverables, and ROI prioritization. Our team recommends short iterations and regular technical reviews.</p>`
            : `<p>نقطة أساسية ${i + 1}: نفّذ هذا القسم بأهداف قابلة للقياس ومخرجات واضحة وأولوية للعائد. يوصي فريقنا بخطوات قصيرة ومراجعات تقنية منتظمة.</p>`;
      const list =
        locale === "fr"
          ? `<ul><li>Audit initial et cadrage</li><li>Prototype ou MVP ciblé</li><li>Mesure des KPIs business</li><li>Optimisation continue</li></ul>`
          : locale === "en"
            ? `<ul><li>Initial audit and scoping</li><li>Targeted prototype or MVP</li><li>Business KPI tracking</li><li>Continuous optimization</li></ul>`
            : `<ul><li>تدقيق أولي وتحديد النطاق</li><li>نموذج أولي أو MVP</li><li>قياس مؤشرات الأعمال</li><li>تحسين مستمر</li></ul>`;
      return `<h2>${heading}</h2>${p}${list}`;
    })
    .join("");

  const cta =
    locale === "fr"
      ? `<h3>Travailler avec D-GITALCODE</h3><p>Besoin d'un partenaire technique pour accélérer votre projet ? <a href="/fr/contact">Contactez notre équipe</a> pour un audit gratuit.</p>`
      : locale === "en"
        ? `<h3>Work with D-GITALCODE</h3><p>Need a technical partner to accelerate your project? <a href="/en/contact">Contact our team</a> for a free audit.</p>`
        : `<h3>اعمل مع D-GITALCODE</h3><p>هل تحتاج شريكاً تقنياً لتسريع مشروعك؟ <a href="/ar/contact">تواصل مع فريقنا</a> لمراجعة مجانية.</p>`;

  return `${intro}<h2>${title}</h2>${body}${cta}`;
}

function metaTitle(title: string) {
  return `${title} | ${AUTHOR}`;
}

async function seedCategories() {
  const map = new Map<string, string>();

  for (const [slug, names] of Object.entries(BLOG_CATEGORIES)) {
    const cat = await prisma.blogCategory.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        translations: {
          create: [
            { locale: "fr", name: names.fr },
            { locale: "en", name: names.en },
            { locale: "ar", name: names.ar },
          ],
        },
      },
    });
    map.set(slug, cat.id);
  }

  return map;
}

async function seedTags() {
  const tagNames = new Set<string>();
  for (const article of BLOG_ARTICLES) {
    article.tags.forEach((t) => tagNames.add(t));
  }
  const map = new Map<string, string>();
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const tag = await prisma.blogTag.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
    map.set(name, tag.id);
  }
  return map;
}

async function seedArticle(
  article: BlogArticleSeed,
  categoryMap: Map<string, string>,
  tagMap: Map<string, string>
) {
  const publishedAt = new Date();
  publishedAt.setDate(publishedAt.getDate() - article.daysAgo);

  const cover = getBlogImage(
    article.slug,
    article.category,
    article.titles.en
  ).image;

  const post = await prisma.blogPost.upsert({
    where: { slug: article.slug },
    update: {
      published: true,
      featured: article.featured ?? false,
      publishedAt,
      image: cover,
    },
    create: {
      slug: article.slug,
      published: true,
      featured: article.featured ?? false,
      publishedAt,
      image: cover,
      translations: {
        create: (["fr", "en", "ar"] as const).map((locale) => ({
          locale,
          title: article.titles[locale],
          excerpt: article.excerpts[locale],
          content: buildContent(article, locale),
          metaTitle: metaTitle(article.titles[locale]),
          metaDescription: `${article.excerpts[locale]} Mots-clés: ${article.keywords.join(", ")}.`,
        })),
      },
    },
  });

  const categoryId = categoryMap.get(article.category);
  if (categoryId) {
    await prisma.blogPostCategory.upsert({
      where: {
        postId_categoryId: { postId: post.id, categoryId },
      },
      update: {},
      create: { postId: post.id, categoryId },
    });
  }

  for (const tagName of article.tags) {
    const tagId = tagMap.get(tagName);
    if (tagId) {
      await prisma.blogPostTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId } },
        update: {},
        create: { postId: post.id, tagId },
      });
    }
  }
}

async function main() {
  const categoryMap = await seedCategories();
  const tagMap = await seedTags();

  for (const article of BLOG_ARTICLES) {
    await seedArticle(article, categoryMap, tagMap);
  }

  const count = await prisma.blogPost.count({ where: { published: true } });
  console.log(`Blog seed complete: ${count} published articles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
