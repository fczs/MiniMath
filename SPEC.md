# MiniMath Game Technical Specification

## Overview

MiniMath is an educational game for children (6+) and adults covering addition, subtraction, multiplication, division, mixed expressions, and simple linear equations. It is a single-page application (SPA) built with Next.js. Styling is implemented with SCSS modules. Light and dark themes are supported.

## Functional Requirements

- Mode selection on the home page (six modes).
- Three difficulty levels: 1-digit, 2-digit, and 3-digit numbers.
- Problem generation per selected mode and level; instant feedback (green = correct, red = incorrect) with friendly hints.
- Answer input via keyboard or on-screen controls; “Skip” option available.
- Final statistics screen showing accuracy, time, streak, and mistakes.
- Supportive tone in UI copy (e.g., "Great job!", "Almost there!") with emoji allowed.
- Pedagogical abstractions (introduced progressively):
  - Number line
  - Groups/arrays of dots
  - Partitioning into equal parts (division)
  - Balance scale (equations)
- Themes: light and dark; respect `prefers-color-scheme`; remember the user’s choice.

## Non-Functional Requirements

- **Performance:** initial load < 2s on an average mobile device; interaction latency < 100ms; pre-generate the next problem.
- **Security:** no account required in MVP; progress stored locally (LocalStorage).
- **Usability/Accessibility:** large controls (≥ 44×44 px), visible `:focus-visible`, WCAG AA contrast, full keyboard and touch support.
- **Compatibility:** Chrome, Safari, Firefox, and Edge (last two versions); supports devices from 576px up to ≥ 1400px.

## Technical Requirements

- Next.js (App Router, TypeScript).
- SCSS modules for components, plus a single `globals.scss` for base styles and variables.
- Responsive breakpoints: **576, 768, 992, 1200, 1400**.
- Dark theme via `data-theme="dark"` attribute on `<html>` and CSS variables.
- Style architecture:
  - `styles/_breakpoints.scss` — breakpoint map and mixin.
  - `styles/_tokens.scss` — design tokens (fonts, shadows, radii, sizes).
  - `styles/_theme.scss` — CSS variables for light and dark themes.
  - `styles/globals.scss` — normalize/reset and base elements.
  - `*.module.scss` — component-level styles.

## Design Requirements (Kids Focus)

- Colorful look, friendly shapes, soft shadows, large buttons.
- Typography: large headings; numbers shown in a monospaced, highly readable font.
- State indicators: use color **and** icon/text (do not rely on color alone).
- Illustrative abstractions:
  - Addition/subtraction — animation along a number line
  - Multiplication — arrays (r×c dots/tokens)
  - Division — “distribute onto plates” (equal groups)
  - Equations — balance scale (“add to both sides…”)
- Microcopy examples: "Awesome!", "So close—shall we try again?", "You’re on the right track!"
