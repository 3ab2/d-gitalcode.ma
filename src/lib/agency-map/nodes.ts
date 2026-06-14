export type AgencyMapNodeId =
  | "web"
  | "uiux"
  | "seo"
  | "ecommerce"
  | "branding"
  | "automation";

export interface AgencyMapNodeConfig {
  id: AgencyMapNodeId;
  position: [number, number, number];
  color: string;
  emissive: string;
  hrefKey: "service" | "services" | "contact";
  serviceSlug?: string;
}

export const AGENCY_MAP_NODES: AgencyMapNodeConfig[] = [
  {
    id: "web",
    position: [0, 0, 0],
    color: "#25d366",
    emissive: "#25d366",
    hrefKey: "service",
    serviceSlug: "web-development",
  },
  {
    id: "uiux",
    position: [-2.1, 0.45, 0.65],
    color: "#6c4cf1",
    emissive: "#8b6cf7",
    hrefKey: "services",
  },
  {
    id: "seo",
    position: [2.05, 0.35, -0.55],
    color: "#38bdf8",
    emissive: "#22d3ee",
    hrefKey: "contact",
  },
  {
    id: "ecommerce",
    position: [-0.55, -1.15, 1.25],
    color: "#a78bfa",
    emissive: "#7c3aed",
    hrefKey: "service",
    serviceSlug: "web-development",
  },
  {
    id: "branding",
    position: [1.55, -0.85, 0.95],
    color: "#f472b6",
    emissive: "#ec4899",
    hrefKey: "contact",
  },
  {
    id: "automation",
    position: [0.35, 1.35, -1.45],
    color: "#34d399",
    emissive: "#10b981",
    hrefKey: "contact",
  },
];

export const AGENCY_MAP_EDGES: [AgencyMapNodeId, AgencyMapNodeId][] = [
  ["web", "uiux"],
  ["web", "seo"],
  ["web", "ecommerce"],
  ["web", "branding"],
  ["web", "automation"],
  ["uiux", "seo"],
  ["uiux", "branding"],
  ["seo", "automation"],
  ["ecommerce", "branding"],
  ["ecommerce", "automation"],
];

export function getNodeHref(
  locale: string,
  node: AgencyMapNodeConfig
): string {
  const base = `/${locale}`;
  if (node.hrefKey === "service" && node.serviceSlug) {
    return `${base}/services/${node.serviceSlug}`;
  }
  if (node.hrefKey === "services") return `${base}/services`;
  return `${base}/contact`;
}

export function getNodeById(id: AgencyMapNodeId) {
  return AGENCY_MAP_NODES.find((node) => node.id === id);
}
