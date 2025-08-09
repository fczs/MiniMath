# MiniMath Game Technical Specification

## Overview

The MiniMath game is designed to teach basic math operations to children and adults. The game will be built as a SPA using Next.js and Tailwind CSS.

**Purpose & Audience**

- Help learners (ages \~6+, including adults brushing up) practice addition, subtraction, multiplication, division, mixed expressions, and simple linear equations in a friendly, confidence-building environment.

**Key Features**

- Six modes: Addition, Subtraction, Multiplication, Division, Mixed (2–3 operations per expression), Linear Equations (e.g., `ax + b = c`).
- Three difficulty levels:
  **Level 1**: single-digit (0–9)
  **Level 2**: two-digit (10–99)
  **Level 3**: three-digit (100–999)
- Randomized problem generation per mode & level, immediate feedback, session statistics, encouraging tone, modern UI, responsive layout, and light/dark themes.

## Functional Requirements

- User selects a mode on the main page.
  - Main page lists all six modes with brief descriptions and difficulty selector (Level 1–3).
  - Optional quick-start: last used mode & difficulty highlighted.

- The game generates random math problems based on the selected mode and difficulty level.
  - **Operand ranges by level**:
    L1: 0–9; L2: 10–99; L3: 100–999.
  - **Mode constraints**:
    - **Addition**: `a + b` (may extend to 3 terms in Mixed).
    - **Subtraction**: ensure `a ≥ b` to avoid negative results on L1; allow negatives on L2–L3 (configurable flag, default off for L2).
    - **Multiplication**: `a × b`.
    - **Division**: non-zero divisor; ensure integer results on L1–L2; allow non-integer disabled by default on L3 (configurable to keep focus on basics).
    - **Mixed**: 2–3 terms with `+ − × ÷`, parentheses as needed; keep final result within a readable range (e.g., −9999..9999); enforce integer intermediate results for L1–L2.
    - **Linear Equations**: `a x + b = c` (or `a x − b = c`); choose integers to yield integer `x`; for L1 keep |a| ≤ 5, |b|,|c| ≤ 20; scale up for higher levels.

  - Example behavior: **Input**: Addition + Level 1 → **Output**: “2 + 3 = ?”

- User inputs answers and receives immediate feedback.
  - Single input field; on Enter or “Check” button, validate and show:
    - **Correct**: green highlight, friendly praise (“Great job! 🎉”).
    - **Incorrect**: red highlight, supportive hint (optionally show correct answer after 1 retry).

  - Optional “Skip” (counts as incorrect; reveals answer to keep learning moving).
  - Keyboard-friendly: Enter=submit, Tab=focus, Esc=quick menu.

- The game displays statistics at the end.
  - Summary after N questions (default N=10; allow 5/10/20 selection):
    - Total correct/incorrect, accuracy %, best streak, average response time, per-operation breakdown (for Mixed), and list of missed problems with correct answers.

  - “Play again” and “Change mode/level” calls to action.

- Support for light and dark themes.
  - Toggle in header; persists in `localStorage`; respects `prefers-color-scheme`.

- (If applicable) User authentication.
  - **MVP**: no sign-in required; local profile (nickname, avatar color) stored in `localStorage`.
  - **Future-ready**: pluggable OAuth (e.g., NextAuth) to sync progress across devices (optional, out of MVP scope).

- Session management & persistence.
  - Persist last mode, level, theme, and recent stats locally.

- Internationalization (i18n) readiness.
  - Copy and number formatting routed through a simple i18n layer (e.g., `next-intl`), default English; room to add Spanish/Russian later.

- Accessibility & supportive tone.
  - Large controls, ARIA labels, color-contrast compliant; friendly microcopy throughout.

## Non-Functional Requirements

- The game should be performant, secure, usable, and compatible with various devices and browsers.
  - **Performance**
    - TTI < 2s on median mobile; interactions < 100ms.
    - Bundle splitting; tree-shaking; code-splitting per mode page.
    - Problem generation O(1) per item; pre-generate next item to eliminate wait time.

  - **Security**
    - No PII by default; only local storage of simple settings/stats.
    - If auth added later: secure cookies, CSRF protection (NextAuth), no sensitive data in client storage.

  - **Usability**
    - Clear flows; consistent placement of controls; forgiving inputs (trim spaces, accept `,` or `.`).
    - Hints and retries without shaming; optional sound/vibration (user-toggle).

  - **Compatibility**
    - Latest Chrome, Firefox, Safari, Edge; graceful fallback for older browsers.
    - Touch, mouse, and keyboard; works from small phones to large desktops.
    - Offline-capable (optional PWA enhancement in later milestone).

## Technical Requirements

- SPA built with Next.js.
  - Next.js App Router; routes:
    `/` (mode selection), `/play/[mode]` for each mode, `/results` for summary.
  - Client-side navigation; static assets served via Next build.

- Styling with Tailwind CSS.
  - Custom Tailwind config for design tokens (spacing, font sizes, colors), focus states, and dark mode (`class` strategy).

- Adaptive layout for breakpoints 576, 768, 992, 1200, and 1400.
  - Tailwind `theme.screens` configured to:
    `xs: '576px', sm: '768px', md: '992px', lg: '1200px', xl: '1400px'`.

- State management & utilities.
  - React Context + Reducer for game session (mode, level, queue, stats).
  - Utility module for RNG (seedable for tests), expression builders, and validators.
  - `localStorage` adapter for persistence with versioned schema.

- Testing.
  - Unit tests (Vitest/Jest) for generators/validators.
  - Component tests (React Testing Library).
  - E2E smoke (Playwright) for core flows.

- Analytics (optional, privacy-first).
  - Simple event counters (no PII) to refine difficulty tuning; opt-out toggle.

## Design Requirements

- Modern and visually appealing interface.
  - Clean cards, soft shadows, rounded corners, subtle animations (reduced-motion respected).
  - Friendly iconography; clear affordances for primary/secondary actions.

- Large text and controls for accessibility.
  - Minimum 16px base; scalable up; large tap targets (≥44×44px).
  - High-contrast color pairs; never rely on color alone to convey correctness (use icons/text).

- Support for light and dark themes.
  - Harmonized palettes; identical contrast targets; theme toggle visible in header.
  - Focus states clearly visible in both themes.

## Implementation Plan

1. Set up the Next.js project.
   - Initialize Next.js (App Router) + TypeScript; configure ESLint/Prettier; add Tailwind with custom screens and dark mode.

2. Implement the main page for mode selection.
   - Grid of six mode cards; difficulty selector; quick-start; theme toggle; i18n placeholders.

3. Develop each game mode.
   - Route `/play/[mode]`; shared GameShell (timer, progress, input, feedback panel); per-mode problem renderer.

4. Implement difficulty levels.
   - Central config maps level → operand ranges & constraints; UI selector persists choice; enforce constraints in generators.

5. Generate random math problems.
   - **Addition/Subtraction**: sample `a,b` from range; for subtraction ensure `a≥b` on L1 (and on L2 if configured).
   - **Multiplication**: sample `a,b`; cap displayed length by level.
   - **Division**: choose `q` and `b` then compute `a=q*b` to ensure integer division; forbid `b=0`.
   - **Mixed**: randomly choose 2–3 ops; sample operands; insert parentheses to keep integer intermediates on L1–L2; evaluate to ensure result bounds.
   - **Linear Equations**: sample `a,b,x` → compute `c=a*x+b`; display `a x + b = c`; require numeric `x`.
   - Pre-generate next problem while user answers current one.

6. Handle user input and provide feedback.
   - Validate numeric input; tolerant parsing; Enter=submit; show Correct/Incorrect banners, supportive copy, and optional hint or one retry before revealing answer.

7. Display statistics.
   - End-of-session summary: total, accuracy, streaks, avg time, missed problems list; “Play again” and “Change mode/level”; save snapshot to `localStorage`.

8. Implement light and dark themes.
   - `class`-based dark mode; toggle persists; respect `prefers-color-scheme`; ensure contrast and focus visibility across themes.

## Conclusion

The MiniMath game aims to provide an engaging and educational experience for users to learn basic math operations. By following this technical specification, the game will be developed to be performant, secure, and accessible.
