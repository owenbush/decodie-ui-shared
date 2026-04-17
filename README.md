<p align="center"><img src="assets/decodie-logo.png" alt="Decodie" width="200"></p>

# Decodie UI Shared

Shared styles, utilities, and CSS class constants for all [Decodie](https://decodie.owenbush.dev) UI consumers.

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

- **[decodie-ui](https://github.com/owenbush/decodie-ui)** (CLI) — imports CSS + utilities, renders with vanilla JS
- **[decodie-cloud](https://github.com/owenbush/decodie-cloud)** (SaaS) — imports CSS + utilities, renders with React components

## Publishing

Releases are published to npm automatically via GitHub Actions when a release is created. Tag releases with `v0.1.0` style semver.
