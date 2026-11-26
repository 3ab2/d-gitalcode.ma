import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";

export const blogTranslationSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  metaTitle: z.string().max(120).optional(),
  metaDescription: z.string().max(320).optional(),
});

export const blogSchema = z.object({
  slug: z.string().min(1).max(200),
  image: z.string().max(2048).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().optional().nullable(),
  translations: z.array(blogTranslationSchema).min(1),
  categoryIds: z.array(z.string()).optional(),
  tagNames: z.array(z.string().min(1).max(80)).optional(),
});

export const serviceTranslationSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  shortDesc: z.string().max(500).optional(),
  features: z.array(z.string()).optional(),
});

export const serviceSchema = z.object({
  slug: z.string().min(1).max(200),
  type: z.enum([
    "WEB_DEVELOPMENT",
    "MOBILE_APPS",
    "WORDPRESS_PLUGINS",
    "WORDPRESS_TEMPLATES",
  ]),
  price: z.number().nonnegative().optional().nullable(),
  priceLabel: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  image: z.string().max(2048).optional(),
  demoUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().int().optional(),
  translations: z.array(serviceTranslationSchema).min(1),
});

export const portfolioTranslationSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  overview: z.string().max(5000).optional(),
  challenge: z.string().max(5000).optional(),
  solution: z.string().max(5000).optional(),
  features: z.array(z.string()).optional(),
  results: z.string().max(5000).optional(),
  outcome: z.string().max(5000).optional(),
  client: z.string().max(200).optional(),
});

export const portfolioSchema = z.object({
  slug: z.string().min(1).max(200),
  image: z.string().max(2048).optional(),
  gallery: z.array(z.string().max(2048)).optional(),
  url: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().int().optional(),
  translations: z.array(portfolioTranslationSchema).min(1),
});

export const submissionStatusSchema = z.object({
  status: z.nativeEnum(SubmissionStatus),
});

export const socialLinksUpdateSchema = z.object({
  links: z.array(
    z.object({
      platform: z.enum(["instagram", "linkedin", "github", "youtube", "kofi"]),
      url: z.string().url(),
      label: z.string().min(1).max(80),
      enabled: z.boolean(),
    })
  ),
});
