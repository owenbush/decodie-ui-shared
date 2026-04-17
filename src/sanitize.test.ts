import { describe, it, expect } from "vitest";
import { sanitizeMarkdown } from "./sanitize";

describe("sanitizeMarkdown — XSS prevention", () => {
  it("strips inline <script> tags", async () => {
    const html = await sanitizeMarkdown('Hello <script>alert("xss")</script> world');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert");
    expect(html).toContain("Hello");
  });

  it("strips javascript: hrefs in links", async () => {
    const html = await sanitizeMarkdown('[click me](javascript:alert("xss"))');
    expect(html).not.toContain("javascript:");
  });

  it("strips vbscript: hrefs", async () => {
    const html = await sanitizeMarkdown('[click](vbscript:MsgBox("xss"))');
    expect(html).not.toContain("vbscript:");
  });

  it("strips data: hrefs", async () => {
    const html = await sanitizeMarkdown('[click](data:text/html,<script>alert(1)</script>)');
    expect(html).not.toContain("data:");
  });

  it("strips <iframe> tags", async () => {
    const html = await sanitizeMarkdown('<iframe src="https://evil.com"></iframe>');
    expect(html).not.toContain("<iframe");
  });

  it("strips <object> tags", async () => {
    const html = await sanitizeMarkdown('<object data="evil.swf"></object>');
    expect(html).not.toContain("<object");
  });

  it("strips <embed> tags", async () => {
    const html = await sanitizeMarkdown('<embed src="evil.swf">');
    expect(html).not.toContain("<embed");
  });

  it("strips <style> tags", async () => {
    const html = await sanitizeMarkdown("<style>body{display:none}</style>Hello");
    expect(html).not.toContain("<style");
    expect(html).toContain("Hello");
  });

  it("strips event handler attributes", async () => {
    const html = await sanitizeMarkdown('<div onmouseover="alert(1)">hover me</div>');
    expect(html).not.toContain("onmouseover");
  });

  it("strips base64 SVG with embedded script", async () => {
    const payload =
      '![x](data:image/svg+xml;base64,PHN2ZyBvbmxvYWQ9YWxlcnQoMSk+)';
    const html = await sanitizeMarkdown(payload);
    expect(html).not.toContain("data:image/svg");
  });
});

describe("sanitizeMarkdown — allowed content", () => {
  it("renders basic markdown: bold, italic, code", async () => {
    const html = await sanitizeMarkdown("**bold** *italic* `code`");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<code>code</code>");
  });

  it("renders code blocks", async () => {
    const html = await sanitizeMarkdown("```typescript\nconst x = 1;\n```");
    expect(html).toContain("<code");
    expect(html).toContain("const x = 1;");
  });

  it("renders links with https", async () => {
    const html = await sanitizeMarkdown("[Docs](https://example.com)");
    expect(html).toContain('href="https://example.com"');
  });

  it("allows <details> and <summary>", async () => {
    const html = await sanitizeMarkdown("<details><summary>More</summary>Content</details>");
    expect(html).toContain("<details>");
    expect(html).toContain("<summary>");
  });

  it("allows <sup> and <sub>", async () => {
    const html = await sanitizeMarkdown("H<sub>2</sub>O and x<sup>2</sup>");
    expect(html).toContain("<sub>2</sub>");
    expect(html).toContain("<sup>2</sup>");
  });

  it("allows GitHub avatar images", async () => {
    const html = await sanitizeMarkdown(
      '![avatar](https://avatars.githubusercontent.com/u/12345)',
    );
    expect(html).toContain("avatars.githubusercontent.com");
  });

  it("strips images from untrusted hosts", async () => {
    const html = await sanitizeMarkdown("![evil](https://evil.com/tracking.png)");
    expect(html).not.toContain("evil.com");
  });
});
