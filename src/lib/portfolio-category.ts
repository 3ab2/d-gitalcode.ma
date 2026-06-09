export type PortfolioCategory = "websites" | "mobile" | "wordpress" | "other" | "all";

export function inferPortfolioCategory(technologies: string[]): Exclude<PortfolioCategory, "all"> {
  const tech = technologies.join(" ").toLowerCase();

  if (/wordpress|woocommerce|php|elementor|woo/.test(tech)) {
    return "wordpress";
  }
  if (/react native|flutter|swift|kotlin|ios|android|expo|mobile/.test(tech)) {
    return "mobile";
  }
  if (/next|react|vue|nuxt|svelte|typescript|tailwind|node/.test(tech)) {
    return "websites";
  }
  return "other";
}

export function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
