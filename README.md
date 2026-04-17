# @owenbush/decodie-ui-shared

Shared styles, utilities, and CSS class constants for all Decodie UI consumers.

## Install

```bash
npm install @owenbush/decodie-ui-shared
```

## Usage

### CSS (the visual identity)

```ts
// Import in your entry point (Next.js layout, HTML head, etc.)
import "@owenbush/decodie-ui-shared/styles.css";
```

The stylesheet provides the full Decodie visual language: dark theme, entry detail layout, badges, code blocks, tags, etc. Components that produce HTML with the class names defined in `CSS` will look correct.

### Utilities

```ts
import {
  formatDate,
  detectLanguage,
  escapeHtml,
  experienceLevelClass,
  CSS,
} from "@owenbush/decodie-ui-shared";
```

| Export | What it does |
|---|---|
| `formatDate(iso)` | Formats an ISO date string to "Jan 1, 2026" |
| `detectLanguage(code)` | Heuristic language detection for syntax highlighting |
| `escapeHtml(str)` | HTML entity escaping (for non-React consumers) |
| `worstRefStatus(resolutions)` | Picks the worst reference status from an array |
| `experienceLevelClass(level)` | Returns the CSS class for a badge |
| `CSS` | Object of all CSS class name constants |

### Consumers

- **decodie-ui** (CLI) — imports CSS + utilities, renders with vanilla JS
- **decodie-cloud** (SaaS) — imports CSS + utilities, renders with React components
