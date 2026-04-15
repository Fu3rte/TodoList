# Frontend Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Pinterest-inspired design system with Tailwind CSS, including design tokens, typography, and component styles.

**Architecture:** Create a three-tier design token system (`--base-*`, `--sema-*`, `--comp-*`) with Tailwind CSS integration. Replace Vite boilerplate CSS with Pinterest's warm color palette, Pin Sans typography, and generous border-radius system.

**Tech Stack:** Tailwind CSS v4, PostCSS, Autoprefixer, Google Fonts (Pin Sans fallback stack)

---

## File Structure

```
frontend/src/
├── styles/
│   ├── tokens.css           # Design tokens (CSS variables)
│   ├── typography.css       # Typography system
│   ├── components.css       # Component base styles
│   └── utilities.css        # Utility classes
├── index.css                # Main entry point (imports all styles)
├── App.css                  # App-level styles (to be removed)
└── App.tsx                  # App component (stub, will be replaced)

frontend/tailwind.config.js   # Tailwind configuration
frontend/postcss.config.js   # PostCSS configuration
```

---

## Tasks

1. [Task 1: Install Tailwind CSS and Dependencies](tasks/01-install-tailwind.md)
2. [Task 2: Create Design Tokens CSS](tasks/02-design-tokens.md)
3. [Task 3: Create Typography CSS](tasks/03-typography.md)
4. [Task 4: Create Component Base Styles](tasks/04-component-styles.md)
5. [Task 5: Create Utility Classes and Layout](tasks/05-utilities.md)
6. [Task 6: Update Main CSS Entry Point](tasks/06-main-css.md)
7. [Task 7: Verify Build and Browser Preview](tasks/07-verify.md)

---

## Self-Review Checklist

1. **Spec Coverage:**
   - [x] Warm white canvas (`#ffffff`) with olive/sand-toned neutrals
   - [x] Pinterest Red (`#e60023`) as primary CTA color
   - [x] Pin Sans font with full fallback stack
   - [x] Three-tier token system (`--base-*`, `--sema-*`, `--comp-*`)
   - [x] Border-radius: 16px for buttons/inputs, 20px+ for cards
   - [x] Primary button: Red background, black text, 16px radius
   - [x] Secondary button: Sand gray (`#e5e5e0`), 16px radius
   - [x] Circular action buttons with 50% radius
   - [x] Input styling with warm silver border
   - [x] Flat card design (no heavy shadows)
   - [x] Plum black (`#211922`) for primary text

2. **Placeholder Scan:** No placeholders found - all code is complete and ready to use

3. **Type Consistency:** This is a CSS-only deliverable; no type checking needed

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-15-frontend-styling/index.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach would you prefer?
