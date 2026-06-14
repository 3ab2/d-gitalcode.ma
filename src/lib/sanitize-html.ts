import sanitizeHtmlLib from "sanitize-html";

const BLOG_ALLOWED_TAGS = [
  "h2",
  "h3",
  "h4",
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "b",
  "i",
  "blockquote",
  "code",
  "pre",
  "span",
  "img",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const BLOG_ALLOWED_ATTRIBUTES: sanitizeHtmlLib.IOptions["allowedAttributes"] = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  "*": ["id", "class"],
};

const BLOG_ALLOWED_SCHEMES = ["http", "https", "mailto"];

/** Sanitize CMS blog HTML before storage or render (XSS hardening). */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: BLOG_ALLOWED_TAGS,
    allowedAttributes: BLOG_ALLOWED_ATTRIBUTES,
    allowedSchemes: BLOG_ALLOWED_SCHEMES,
    allowedSchemesByTag: {
      img: ["http", "https"],
      a: ["http", "https", "mailto"],
    },
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          rel: attribs.target === "_blank" ? "noopener noreferrer" : attribs.rel,
        },
      }),
    },
  });
}
