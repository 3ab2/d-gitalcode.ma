"use client";

import { useEffect } from "react";
import {
  trackBlogArticleRead,
  trackBlogArticleView,
} from "@/lib/analytics/blog-articles";

const READ_THRESHOLD = 0.8;
const CONTENT_ID = "blog-article-content";

export function BlogArticleAnalytics({
  slug,
  locale,
  category,
}: {
  slug: string;
  locale: string;
  category: string;
}) {
  useEffect(() => {
    trackBlogArticleView(slug, locale, category);
  }, [slug, locale, category]);

  useEffect(() => {
    let ticking = false;

    const checkReadProgress = () => {
      const el = document.getElementById(CONTENT_ID);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = el.offsetHeight;
      if (articleHeight <= 0) return;

      const scrolled = window.scrollY + window.innerHeight - articleTop;
      const progress = scrolled / articleHeight;

      if (progress >= READ_THRESHOLD) {
        trackBlogArticleRead(slug, locale);
        window.removeEventListener("scroll", onScroll);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        checkReadProgress();
        ticking = false;
      });
    };

    checkReadProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, locale]);

  return null;
}
