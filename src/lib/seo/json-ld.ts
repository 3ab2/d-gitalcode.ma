/**
 * Serialize JSON-LD for an inline <script>. CMS text may contain "</script>";
 * escaping "<" keeps it from closing the element.
 */
export function serializeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
