/**
 * Markdown sanitisation schema and utility.
 *
 * The schema defines the allow-list for HTML elements, attributes, and URL
 * protocols that are safe to render from user-authored .decodie/ entries.
 * Both decodie-ui (vanilla JS) and decodie-cloud (React) consume this
 * schema to ensure consistent XSS prevention across all surfaces.
 */

import { defaultSchema, type Options } from "rehype-sanitize";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const ALLOWED_IMAGE_HOSTS = [
  "avatars.githubusercontent.com",
  "raw.githubusercontent.com",
  "user-images.githubusercontent.com",
];

/**
 * The shared sanitisation schema. Consumers using `react-markdown` pass this
 * to the `rehype-sanitize` plugin. Consumers using the unified pipeline pass
 * it to `rehypeSanitize(decodieSanitizeSchema)`.
 */
export const decodieSanitizeSchema: Options = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "details",
    "summary",
    "sup",
    "sub",
  ].filter(
    (tag) =>
      !["script", "style", "iframe", "object", "embed", "form", "input", "textarea"].includes(tag),
  ),
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    a: ["href"],
    img: ["src", "alt", "title"],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "mailto"],
    src: ["http", "https"],
  },
  strip: ["script", "style"],
};

/**
 * Sanitise a markdown string to safe HTML. For non-React consumers (decodie-ui).
 * React consumers should use `react-markdown` with `decodieSanitizeSchema` instead.
 *
 * Pipeline: remarkParse → remarkRehype (with raw HTML passthrough) → rehypeRaw
 * (parses raw HTML into hast nodes) → rehypeSanitize (strips disallowed nodes)
 * → rehypeStringify.
 */
export async function sanitizeMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, decodieSanitizeSchema)
    .use(rehypeStringify)
    .process(markdown);

  let html = String(file);

  // Strip remote images not on the allow-list.
  html = html.replace(/<img\s+[^>]*src="([^"]*)"[^>]*>/gi, (match, src: string) => {
    try {
      const url = new URL(src);
      if (ALLOWED_IMAGE_HOSTS.includes(url.hostname)) return match;
    } catch {
      // Relative URLs or malformed — strip.
    }
    return "";
  });

  return html;
}
