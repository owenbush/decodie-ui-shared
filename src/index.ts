/**
 * @owenbush/decodie-ui-shared
 *
 * Shared styles, utilities, and constants for all Decodie UI consumers
 * (decodie-ui CLI, decodie-cloud SaaS, VS Code extension, etc.).
 *
 * Import the CSS:
 *   import "@owenbush/decodie-ui-shared/styles.css";
 *
 * Import utilities:
 *   import { formatDate, detectLanguage, experienceLevelClass } from "@owenbush/decodie-ui-shared";
 */

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Language detection (heuristic for syntax highlighting)
// ---------------------------------------------------------------------------

export function detectLanguage(code: string): string {
  if (!code) return "plaintext";
  if (code.includes("import ") && (code.includes(" from ") || code.includes("require(")))
    return "typescript";
  if (code.includes("def ") || (code.includes("import ") && code.includes(":"))) return "python";
  if (code.includes("func ") && code.includes(":=")) return "go";
  if (code.includes("fn ") && code.includes("->")) return "rust";
  if (
    code.includes("function ") ||
    code.includes("=>") ||
    code.includes("const ") ||
    code.includes("let ")
  )
    return "javascript";
  if (code.includes("<") && code.includes("/>")) return "jsx";
  if (/^\s*\{/.test(code)) return "json";
  return "javascript";
}

// ---------------------------------------------------------------------------
// HTML escaping (for non-React consumers that build HTML strings)
// ---------------------------------------------------------------------------

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

// ---------------------------------------------------------------------------
// Reference status
// ---------------------------------------------------------------------------

export type RefStatus = "resolved" | "drifted" | "fuzzy" | "stale";

const REF_STATUS_ORDER: RefStatus[] = ["stale", "fuzzy", "drifted", "resolved"];

export function worstRefStatus(
  resolutions: Array<{ status: string }> | null | undefined,
): RefStatus | null {
  if (!resolutions || resolutions.length === 0) return null;
  let worst: RefStatus = "resolved";
  for (const r of resolutions) {
    const s = r.status as RefStatus;
    if (REF_STATUS_ORDER.indexOf(s) < REF_STATUS_ORDER.indexOf(worst)) {
      worst = s;
    }
  }
  return worst;
}

// ---------------------------------------------------------------------------
// CSS class helpers — keeps class names in sync between consumers
// ---------------------------------------------------------------------------

export type ExperienceLevel = "foundational" | "intermediate" | "advanced" | "ecosystem";

export type DecisionType =
  | "explanation"
  | "rationale"
  | "pattern"
  | "warning"
  | "convention";

export type Lifecycle = "active" | "superseded" | "archived";

export function experienceLevelClass(level: ExperienceLevel): string {
  return `badge badge-${level}`;
}

export function decisionTypeClass(): string {
  return "badge badge-type";
}

export function lifecycleBadgeClass(): string {
  return "badge";
}

export function tagClass(): string {
  return "tag";
}

// ---------------------------------------------------------------------------
// CSS class name constants for entry detail sections
// ---------------------------------------------------------------------------

export const CSS = {
  detailView: "detail-view",
  detailHeader: "detail-header",
  detailTitle: "detail-title",
  detailMeta: "detail-meta",
  detailSection: "detail-section",
  detailSectionTitle: "detail-section-title",
  detailExplanation: "detail-explanation",
  codeBlock: "code-block",
  badge: "badge",
  tag: "tag",
  backBtn: "back-btn",
  entryCard: "entry-card",
  entryTitle: "entry-title",
  entryMeta: "entry-meta",
  stateMessage: "state-message",
  errorBanner: "error-banner",
  collapsibleSection: "collapsible-section",
  breakdownItem: "breakdown-item",
  breakdownExplanation: "breakdown-explanation",
  breakdownPatternBadge: "breakdown-pattern-badge",
  refDot: "ref-dot",
} as const;
