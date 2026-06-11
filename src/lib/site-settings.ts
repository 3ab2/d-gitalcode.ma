import { CONTACT_EMAIL } from "@/config/contact";

export const SETTING_KEYS = {
  CONTACT_EMAIL: "contact_email",
  WHATSAPP_NUMBER: "whatsapp_number",
  PHONE: "phone",
  ADDRESS: "address",
  SEO_TITLE: "seo_title",
  SEO_DESCRIPTION: "seo_description",
  SEO_KEYWORDS: "seo_keywords",
} as const;

export type SiteSettings = {
  contactEmail: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contactEmail: CONTACT_EMAIL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212706984671",
  phone: "+212 706-984671",
  address: "Casablanca, Maroc",
  seoTitle: "D-GITALCODE — Agence Digitale & Solutions WooCommerce",
  seoDescription:
    "Agence digitale spécialisée en développement web, applications mobiles, plugins WooCommerce et solutions eCommerce intelligentes.",
  seoKeywords:
    "développement web, WooCommerce, WhatsApp, WordPress plugins, agence digitale Maroc",
};
