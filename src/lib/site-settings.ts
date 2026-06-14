import { CONTACT_EMAIL } from "@/config/contact";
import { DEFAULT_CURRENCY, type CurrencyCode } from "@/lib/currency";

export const SETTING_KEYS = {
  CONTACT_EMAIL: "contact_email",
  WHATSAPP_NUMBER: "whatsapp_number",
  PHONE: "phone",
  ADDRESS: "address",
  PRODUCT_DEMO_URL: "product_demo_url",
  SEO_TITLE: "seo_title",
  SEO_DESCRIPTION: "seo_description",
  SEO_KEYWORDS: "seo_keywords",
  DEFAULT_CURRENCY: "default_currency",
} as const;

export type SiteSettings = {
  contactEmail: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  productDemoUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  defaultCurrency: CurrencyCode;
};

export const DEFAULT_PRODUCT_DEMO_URL = "https://whatsflow-demo.fwh.is";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contactEmail: CONTACT_EMAIL,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212706984671",
  phone: "+212 706-984671",
  address: "Casablanca, Maroc",
  productDemoUrl: DEFAULT_PRODUCT_DEMO_URL,
  seoTitle: "D-GITALCODE — Agence Digitale & Solutions WooCommerce",
  seoDescription:
    "Agence digitale spécialisée en développement web, applications mobiles, plugins WooCommerce et solutions eCommerce intelligentes.",
  seoKeywords:
    "développement web, WooCommerce, WhatsApp, WordPress plugins, agence digitale Maroc",
  defaultCurrency: DEFAULT_CURRENCY,
};
