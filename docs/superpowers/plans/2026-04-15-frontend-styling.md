# Frontend Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

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

## Task 1: Install Tailwind CSS and Dependencies

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`

- [ ] **Step 1: Install Tailwind CSS v4 and dependencies**

Run: `cd frontend && npm install tailwindcss @tailwindcss/postcss postcss autoprefixer`

Expected: Package.json updated with tailwindcss, @tailwindcss/postcss, postcss, autoprefixer

- [ ] **Step 2: Create postcss.config.js**

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base Colors - Pinterest palette
        brand: {
          red: '#e60023',
          'red-hover': '#ad081b',
        },
        text: {
          primary: '#211922',
          secondary: '#62625b',
          disabled: '#91918c',
          white: '#ffffff',
          black: '#000000',
        },
        surface: {
          sand: '#e5e5e0',
          'warm-light': '#e0e0d9',
          fog: '#f6f6f3',
          dark: '#33332e',
          white: '#ffffff',
        },
        border: {
          disabled: '#c8c8c1',
          hover: '#bcbcb3',
          focus: '#435ee5',
        },
        // Semantic colors
        success: '#103c25',
        error: '#9e0a0a',
        // Interactive
        link: '#2b48d4',
        facebook: '#0866ff',
      },
      fontFamily: {
        sans: [
          'Pin Sans',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Oxygen-Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'Helvetica',
          'sans-serif',
        ],
      },
      borderRadius: {
        DEFAULT: '16px',
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '28px',
        '2xl': '32px',
        hero: '40px',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      fontSize: {
        'display': ['70px', { lineHeight: 'normal', fontWeight: '600' }],
        'section': ['28px', { lineHeight: 'normal', fontWeight: '700', letterSpacing: '-1.2px' }],
        'body': ['16px', { lineHeight: '1.40' }],
        'caption-bold': ['14px', { lineHeight: 'normal', fontWeight: '700' }],
        'caption': ['12px', { lineHeight: '1.50', fontWeight: '400' }],
        'button': ['12px', { lineHeight: 'normal', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Commit**

```bash
cd frontend
git add package.json tailwind.config.js postcss.config.js
git commit -m "feat: install Tailwind CSS v4 and configure postcss"
```

---

## Task 2: Create Design Tokens CSS

**Files:**
- Create: `frontend/src/styles/tokens.css`

- [ ] **Step 1: Create design tokens CSS file**

```css
/* ==========================================================================
   Design Tokens - Pinterest-inspired Three-Tier System
   ========================================================================== */

/* --------------------------------------------------------------------------
   Base Layer (--base-*) - Raw values, never used directly in components
   -------------------------------------------------------------------------- */
:root {
  /* Base Colors - Brand */
  --base-color-brand-red: #e60023;
  --base-color-brand-red-hover: #ad081b;
  --base-color-brand-green-700: #103c25;
  --base-color-brand-green-700-hover: #0b2819;

  /* Base Colors - Text */
  --base-color-text-plum: #211922;
  --base-color-text-black: #000000;
  --base-color-text-olive: #62625b;
  --base-color-text-silver: #91918c;
  --base-color-text-white: #ffffff;

  /* Base Colors - Interactive */
  --base-color-focus-blue: #435ee5;
  --base-color-performance-purple: #6845ab;
  --base-color-recommendation-purple: #7e238b;
  --base-color-link-blue: #2b48d4;
  --base-color-facebook-blue: #0866ff;
  --base-color-pressed-blue: #617bff;

  /* Base Colors - Surface */
  --base-color-surface-sand: #e5e5e0;
  --base-color-surface-warm-light: #e0e0d9;
  --base-color-surface-border-disabled: #c8c8c1;
  --base-color-surface-hover-gray: #bcbcb3;
  --base-color-surface-dark: #33332e;
  --base-color-surface-white: #ffffff;

  /* Base Colors - Semantic */
  --base-color-error-red: #9e0a0a;
  --base-color-badge-wash: hsla(60, 20%, 98%, 0.5);

  /* Base Typography */
  --base-font-family: 'Pin Sans', -apple-system, system-ui, 'Segoe UI', Roboto, sans-serif;
  --base-font-size-display: 70px;
  --base-font-size-section: 28px;
  --base-font-size-body: 16px;
  --base-font-size-caption: 14px;
  --base-font-size-small: 12px;

  /* Base Spacing (8px base) */
  --base-spacing-unit: 8px;
  --base-radius-sm: 12px;
  --base-radius-md: 16px;
  --base-radius-lg: 20px;
  --base-radius-xl: 28px;
  --base-radius-2xl: 32px;
  --base-radius-hero: 40px;
  --base-radius-full: 50%;
}

/* --------------------------------------------------------------------------
   Semantic Layer (--sema-*) - Contextual meaning, used in components
   -------------------------------------------------------------------------- */
:root {
  /* Semantic: Color Roles */
  --sema-color-text-primary: var(--base-color-text-plum);
  --sema-color-text-secondary: var(--base-color-text-olive);
  --sema-color-text-disabled: var(--base-color-text-silver);
  --sema-color-text-inverse: var(--base-color-text-white);

  --sema-color-background-primary: var(--base-color-surface-white);
  --sema-color-background-secondary: var(--base-color-surface-sand);
  --sema-color-background-tertiary: var(--base-color-surface-warm-light);
  --sema-color-background-wash: var(--base-color-badge-wash);

  --sema-color-brand-primary: var(--base-color-brand-red);
  --sema-color-brand-primary-hover: var(--base-color-brand-red-hover);
  --sema-color-brand-success: var(--base-color-brand-green-700);
  --sema-color-brand-success-hover: var(--base-color-brand-green-700-hover);

  --sema-color-border-default: var(--base-color-text-silver);
  --sema-color-border-hover: var(--base-color-surface-hover-gray);
  --sema-color-border-disabled: var(--base-color-surface-border-disabled);
  --sema-color-border-focus: var(--base-color-focus-blue);

  --sema-color-interactive-link: var(--base-color-link-blue);
  --sema-color-interactive-focus: var(--base-color-focus-blue);

  --sema-color-error: var(--base-color-error-red);

  /* Semantic: Typography */
  --sema-font-family-primary: var(--base-font-family);
  --sema-font-size-display: var(--base-font-size-display);
  --sema-font-size-section: var(--base-font-size-section);
  --sema-font-size-body: var(--base-font-size-body);
  --sema-font-size-caption: var(--base-font-size-caption);
  --sema-font-size-small: var(--base-font-size-small);

  /* Semantic: Spacing */
  --sema-spacing-xs: calc(var(--base-spacing-unit) * 0.5);   /* 4px */
  --sema-spacing-sm: calc(var(--base-spacing-unit) * 0.75); /* 6px */
  --sema-spacing-md: var(--base-spacing-unit);               /* 8px */
  --sema-spacing-lg: calc(var(--base-spacing-unit) * 1.5);   /* 12px */
  --sema-spacing-xl: calc(var(--base-spacing-unit) * 2);     /* 16px */
  --sema-spacing-2xl: calc(var(--base-spacing-unit) * 3);    /* 24px */
  --sema-spacing-3xl: calc(var(--base-spacing-unit) * 4);    /* 32px */

  /* Semantic: Border Radius */
  --sema-radius-sm: var(--base-radius-sm);
  --sema-radius-md: var(--base-radius-md);
  --sema-radius-lg: var(--base-radius-lg);
  --sema-radius-xl: var(--base-radius-xl);
  --sema-radius-2xl: var(--base-radius-2xl);
  --sema-radius-hero: var(--base-radius-hero);
  --sema-radius-full: var(--base-radius-full);
}

/* --------------------------------------------------------------------------
   Component Layer (--comp-*) - Component-specific tokens
   -------------------------------------------------------------------------- */
:root {
  /* Button: Primary */
  --comp-button-color-background-primary: var(--base-color-brand-red);
  --comp-button-color-background-primary-hover: var(--base-color-brand-red-hover);
  --comp-button-color-text-primary: var(--base-color-text-black);
  --comp-button-color-border-primary: rgba(255, 255, 255, 0);
  --comp-button-radius: var(--base-radius-md);
  --comp-button-padding-x: 14px;
  --comp-button-padding-y: 6px;

  /* Button: Secondary (Sand) */
  --comp-button-color-background-secondary: var(--base-color-surface-sand);
  --comp-button-color-background-secondary-hover: var(--base-color-surface-hover-gray);
  --comp-button-color-text-secondary: var(--base-color-text-black);
  --comp-button-radius-secondary: var(--base-radius-md);

  /* Button: Circular Action */
  --comp-button-color-background-circular: var(--base-color-surface-warm-light);
  --comp-button-color-text-circular: var(--base-color-text-plum);
  --comp-button-radius-circular: var(--base-radius-full);

  /* Input */
  --comp-input-color-background: var(--base-color-surface-white);
  --comp-input-color-border: var(--base-color-text-silver);
  --comp-input-color-border-focus: var(--base-color-focus-blue);
  --comp-input-color-text: var(--base-color-text-plum);
  --comp-input-radius: var(--base-radius-md);
  --comp-input-padding-x: 15px;
  --comp-input-padding-y: 11px;

  /* Card */
  --comp-card-color-background: var(--base-color-surface-white);
  --comp-card-radius: var(--base-radius-lg);
  --comp-card-padding: var(--base-spacing-xl);

  /* Badge */
  --comp-badge-color-background: var(--base-color-badge-wash);
  --comp-badge-radius: var(--base-radius-sm);

  /* Navigation */
  --comp-nav-color-background: var(--base-color-surface-white);
  --comp-nav-color-text: var(--base-color-text-plum);
  --comp-nav-color-active: var(--base-color-brand-red);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "feat: add Pinterest-inspired design tokens"
```

---

## Task 3: Create Typography CSS

**Files:**
- Create: `frontend/src/styles/typography.css`

- [ ] **Step 1: Create typography CSS file**

```css
/* ==========================================================================
   Typography System - Pinterest-inspired Pin Sans
   ========================================================================== */

/* Import Google Fonts - Pin Sans with fallback stack */
@import url('https://fonts.googleapis.com/css2?family=Pin+Sans:wght@400;500;600;700&display=swap');

/* --------------------------------------------------------------------------
   Base Typography
   -------------------------------------------------------------------------- */
body {
  font-family: var(--sema-font-family-primary);
  font-size: var(--sema-font-size-body);
  line-height: 1.40;
  color: var(--sema-color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-synthesis: none;
}

/* --------------------------------------------------------------------------
   Typography Scale
   -------------------------------------------------------------------------- */
.font-display {
  font-size: var(--sema-font-size-display);
  font-weight: 600;
  line-height: normal;
  letter-spacing: normal;
  color: var(--sema-color-text-primary);
}

.font-section {
  font-size: var(--sema-font-size-section);
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.2px;
  color: var(--sema-color-text-primary);
}

.font-body {
  font-size: var(--sema-font-size-body);
  font-weight: 400;
  line-height: 1.40;
  color: var(--sema-color-text-primary);
}

.font-caption-bold {
  font-size: var(--sema-font-size-caption);
  font-weight: 700;
  line-height: normal;
  letter-spacing: normal;
  color: var(--sema-color-text-secondary);
}

.font-caption {
  font-size: var(--sema-font-size-small);
  font-weight: 400;
  line-height: 1.50;
  letter-spacing: normal;
  color: var(--sema-color-text-secondary);
}

.font-button {
  font-size: 12px; /* 0.75rem */
  font-weight: 400;
  line-height: normal;
  letter-spacing: normal;
  text-transform: none;
}

/* --------------------------------------------------------------------------
   Heading Styles
   -------------------------------------------------------------------------- */
h1, .h1 {
  font-size: var(--sema-font-size-display);
  font-weight: 600;
  line-height: normal;
  color: var(--sema-color-text-primary);
  margin: 0;
}

h2, .h2 {
  font-size: var(--sema-font-size-section);
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1.2px;
  color: var(--sema-color-text-primary);
  margin: 0;
}

h3, .h3 {
  font-size: var(--sema-font-size-body);
  font-weight: 600;
  line-height: 1.40;
  color: var(--sema-color-text-primary);
  margin: 0;
}

/* --------------------------------------------------------------------------
   Text Utilities
   -------------------------------------------------------------------------- */
.text-primary { color: var(--sema-color-text-primary); }
.text-secondary { color: var(--sema-color-text-secondary); }
.text-disabled { color: var(--sema-color-text-disabled); }
.text-inverse { color: var(--sema-color-text-inverse); }
.text-brand { color: var(--sema-color-brand-primary); }
.text-link { color: var(--sema-color-interactive-link); }
.text-error { color: var(--sema-color-error); }

/* --------------------------------------------------------------------------
   Responsive Typography
   -------------------------------------------------------------------------- */
@media (max-width: 768px) {
  .font-display {
    font-size: clamp(36px, 10vw, 70px);
  }

  .font-section {
    font-size: clamp(24px, 5vw, 28px);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/typography.css
git commit -m "feat: add typography system with Pin Sans"
```

---

## Task 4: Create Component Base Styles

**Files:**
- Create: `frontend/src/styles/components.css`

- [ ] **Step 1: Create component base styles CSS**

```css
/* ==========================================================================
   Component Base Styles - Pinterest-inspired
   ========================================================================== */

/* --------------------------------------------------------------------------
   Buttons
   -------------------------------------------------------------------------- */

/* Primary Button - Pinterest Red */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sema-spacing-sm);
  padding: var(--comp-button-padding-y) var(--comp-button-padding-x);
  background-color: var(--comp-button-color-background-primary);
  color: var(--comp-button-color-text-primary);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  border: 2px solid var(--comp-button-color-border-primary);
  border-radius: var(--comp-button-radius);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary:hover {
  background-color: var(--comp-button-color-background-primary-hover);
  border-color: rgba(255, 255, 255, 0);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Secondary Button - Sand Gray */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sema-spacing-sm);
  padding: var(--comp-button-padding-y) var(--comp-button-padding-x);
  background-color: var(--comp-button-color-background-secondary);
  color: var(--comp-button-color-text-secondary);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  border: none;
  border-radius: var(--comp-button-radius-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-secondary:hover {
  background-color: var(--comp-button-color-background-secondary-hover);
}

.btn-secondary:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

.btn-secondary:active {
  transform: scale(0.98);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Circular Action Button */
.btn-circular {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: var(--comp-button-color-background-circular);
  color: var(--comp-button-color-text-circular);
  border: none;
  border-radius: var(--comp-button-radius-circular);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-circular:hover {
  background-color: var(--base-color-surface-hover-gray);
}

.btn-circular:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

.btn-circular:active {
  transform: scale(0.95);
}

/* Ghost/Transparent Button */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sema-spacing-sm);
  padding: var(--comp-button-padding-y) var(--comp-button-padding-x);
  background-color: transparent;
  color: var(--base-color-text-black);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  border: none;
  border-radius: var(--comp-button-radius);
  cursor: pointer;
  transition: background-color 0.15s ease;
  text-decoration: none;
}

.btn-ghost:hover {
  background-color: var(--base-color-surface-warm-light);
}

.btn-ghost:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

/* Icon Button */
.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: transparent;
  color: var(--sema-color-text-secondary);
  border: none;
  border-radius: var(--sema-radius-full);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.btn-icon:hover {
  background-color: var(--base-color-surface-warm-light);
  color: var(--sema-color-text-primary);
}

.btn-icon:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

/* --------------------------------------------------------------------------
   Inputs
   -------------------------------------------------------------------------- */

.input {
  display: block;
  width: 100%;
  padding: var(--comp-input-padding-y) var(--comp-input-padding-x);
  background-color: var(--comp-input-color-background);
  color: var(--comp-input-color-text);
  font-size: var(--sema-font-size-body);
  font-family: var(--sema-font-family-primary);
  border: 1px solid var(--comp-input-color-border);
  border-radius: var(--comp-input-radius);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.input::placeholder {
  color: var(--sema-color-text-disabled);
}

.input:hover {
  border-color: var(--sema-color-border-hover);
}

.input:focus {
  outline: none;
  border-color: var(--comp-input-color-border-focus);
  box-shadow: 0 0 0 3px rgba(67, 94, 229, 0.15);
}

.input:disabled {
  background-color: var(--base-color-surface-fog);
  border-color: var(--sema-color-border-disabled);
  color: var(--sema-color-text-disabled);
  cursor: not-allowed;
}

/* Input with error */
.input-error {
  border-color: var(--sema-color-error);
}

.input-error:focus {
  border-color: var(--sema-color-error);
  box-shadow: 0 0 0 3px rgba(158, 10, 10, 0.15);
}

/* Input Label */
.input-label {
  display: block;
  font-size: var(--sema-font-size-caption);
  font-weight: 700;
  color: var(--sema-color-text-primary);
  margin-bottom: var(--sema-spacing-sm);
}

/* Input Helper Text */
.input-helper {
  font-size: var(--sema-font-size-small);
  color: var(--sema-color-text-secondary);
  margin-top: var(--sema-spacing-xs);
}

/* Input Error Text */
.input-error-text {
  font-size: var(--sema-font-size-small);
  color: var(--sema-color-error);
  margin-top: var(--sema-spacing-xs);
}

/* --------------------------------------------------------------------------
   Cards
   -------------------------------------------------------------------------- */

.card {
  background-color: var(--comp-card-color-background);
  border-radius: var(--comp-card-radius);
  padding: var(--comp-card-padding);
  /* No shadow - Pinterest is flat by design */
}

.card-elevated {
  background-color: var(--comp-card-color-background);
  border-radius: var(--comp-card-radius);
  padding: var(--comp-card-padding);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

/* --------------------------------------------------------------------------
   Badges / Tags
   -------------------------------------------------------------------------- */

.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--sema-spacing-xs) var(--sema-spacing-sm);
  background-color: var(--comp-badge-color-background);
  border-radius: var(--comp-badge-radius);
  font-size: var(--sema-font-size-small);
  font-weight: 500;
  color: var(--sema-color-text-secondary);
}

/* --------------------------------------------------------------------------
   Checkbox (Custom)
   -------------------------------------------------------------------------- */

.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: var(--sema-spacing-sm);
  cursor: pointer;
}

.checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--sema-color-border-default);
  border-radius: 6px;
  background-color: var(--base-color-surface-white);
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.checkbox:hover {
  border-color: var(--sema-color-border-hover);
}

.checkbox:checked {
  background-color: var(--sema-color-brand-primary);
  border-color: var(--sema-color-brand-primary);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
  background-size: 12px;
  background-position: center;
  background-repeat: no-repeat;
}

.checkbox:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

/* --------------------------------------------------------------------------
   Select Dropdown
   -------------------------------------------------------------------------- */

.select {
  appearance: none;
  display: block;
  width: 100%;
  padding: var(--comp-input-padding-y) var(--comp-input-padding-x);
  padding-right: 40px;
  background-color: var(--comp-input-color-background);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2362625b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  color: var(--comp-input-color-text);
  font-size: var(--sema-font-size-body);
  font-family: var(--sema-font-family-primary);
  border: 1px solid var(--comp-input-color-border);
  border-radius: var(--comp-input-radius);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.select:hover {
  border-color: var(--sema-color-border-hover);
}

.select:focus {
  outline: none;
  border-color: var(--comp-input-color-border-focus);
  box-shadow: 0 0 0 3px rgba(67, 94, 229, 0.15);
}

/* --------------------------------------------------------------------------
   Priority Indicators
   -------------------------------------------------------------------------- */

.priority-high {
  color: var(--sema-color-error);
}

.priority-medium {
  color: var(--base-color-brand-red);
}

.priority-low {
  color: var(--sema-color-text-secondary);
}

/* --------------------------------------------------------------------------
   Avatar
   -------------------------------------------------------------------------- */

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--sema-radius-full);
  background-color: var(--base-color-surface-sand);
  color: var(--sema-color-text-primary);
  font-size: var(--sema-font-size-caption);
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: var(--sema-font-size-small);
}

.avatar-lg {
  width: 56px;
  height: 56px;
  font-size: var(--sema-font-size-body);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/components.css
git commit -m "feat: add Pinterest-inspired component base styles"
```

---

## Task 5: Create Utility Classes and Layout

**Files:**
- Create: `frontend/src/styles/utilities.css`

- [ ] **Step 1: Create utilities CSS file**

```css
/* ==========================================================================
   Utility Classes and Layout - Pinterest-inspired
   ========================================================================== */

/* --------------------------------------------------------------------------
   Spacing Utilities
   -------------------------------------------------------------------------- */
.gap-xs { gap: var(--sema-spacing-xs); }
.gap-sm { gap: var(--sema-spacing-sm); }
.gap-md { gap: var(--sema-spacing-md); }
.gap-lg { gap: var(--sema-spacing-lg); }
.gap-xl { gap: var(--sema-spacing-xl); }
.gap-2xl { gap: var(--sema-spacing-2xl); }

.p-xs { padding: var(--sema-spacing-xs); }
.p-sm { padding: var(--sema-spacing-sm); }
.p-md { padding: var(--sema-spacing-md); }
.p-lg { padding: var(--sema-spacing-lg); }
.p-xl { padding: var(--sema-spacing-xl); }
.p-2xl { padding: var(--sema-spacing-2xl); }

.m-xs { margin: var(--sema-spacing-xs); }
.m-sm { margin: var(--sema-spacing-sm); }
.m-md { margin: var(--sema-spacing-md); }
.m-lg { margin: var(--sema-spacing-lg); }
.m-xl { margin: var(--sema-spacing-xl); }
.m-2xl { margin: var(--sema-spacing-2xl); }

.mt-xs { margin-top: var(--sema-spacing-xs); }
.mt-sm { margin-top: var(--sema-spacing-sm); }
.mt-md { margin-top: var(--sema-spacing-md); }
.mt-lg { margin-top: var(--sema-spacing-lg); }
.mt-xl { margin-top: var(--sema-spacing-xl); }
.mt-2xl { margin-top: var(--sema-spacing-2xl); }

.mb-xs { margin-bottom: var(--sema-spacing-xs); }
.mb-sm { margin-bottom: var(--sema-spacing-sm); }
.mb-md { margin-bottom: var(--sema-spacing-md); }
.mb-lg { margin-bottom: var(--sema-spacing-lg); }
.mb-xl { margin-bottom: var(--sema-spacing-xl); }
.mb-2xl { margin-bottom: var(--sema-spacing-2xl); }

/* --------------------------------------------------------------------------
   Flexbox Utilities
   -------------------------------------------------------------------------- */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.flex-1 { flex: 1; }
.flex-auto { flex: auto; }
.flex-shrink-0 { flex-shrink: 0; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

.self-start { align-self: flex-start; }
.self-center { align-self: center; }
.self-end { align-self: flex-end; }

/* --------------------------------------------------------------------------
   Grid Utilities
   -------------------------------------------------------------------------- */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-auto { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

/* --------------------------------------------------------------------------
   Layout Containers
   -------------------------------------------------------------------------- */

/* App Shell - Main layout wrapper */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--sema-color-background-primary);
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Page Container - Centered content with max-width */
.page-container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--sema-spacing-xl);
}

@media (max-width: 768px) {
  .page-container {
    padding: 0 var(--sema-spacing-md);
  }
}

/* Card Grid - Pinterest-style masonry-like layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--sema-spacing-lg);
}

/* --------------------------------------------------------------------------
   Visibility Utilities
   -------------------------------------------------------------------------- */
.hidden { display: none; }
.visible { visibility: visible; }
.invisible { visibility: hidden; }
.opacity-0 { opacity: 0; }
.opacity-50 { opacity: 0.5; }
.opacity-100 { opacity: 1; }

/* --------------------------------------------------------------------------
   Border Utilities
   -------------------------------------------------------------------------- */
.rounded-none { border-radius: 0; }
.rounded-sm { border-radius: var(--sema-radius-sm); }
.rounded-md { border-radius: var(--sema-radius-md); }
.rounded-lg { border-radius: var(--sema-radius-lg); }
.rounded-xl { border-radius: var(--sema-radius-xl); }
.rounded-full { border-radius: var(--sema-radius-full); }

.border { border: 1px solid var(--sema-color-border-default); }
.border-0 { border: none; }
.border-t { border-top: 1px solid var(--sema-color-border-default); }
.border-b { border-bottom: 1px solid var(--sema-color-border-default); }
.border-l { border-left: 1px solid var(--sema-color-border-default); }
.border-r { border-right: 1px solid var(--sema-color-border-default); }

/* --------------------------------------------------------------------------
   Overflow Utilities
   -------------------------------------------------------------------------- */
.overflow-auto { overflow: auto; }
.overflow-hidden { overflow: hidden; }
.overflow-scroll { overflow: scroll; }
.overflow-visible { overflow: visible; }
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* --------------------------------------------------------------------------
   Position Utilities
   -------------------------------------------------------------------------- */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.top-0 { top: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }

/* --------------------------------------------------------------------------
   Width/Height Utilities
   -------------------------------------------------------------------------- */
.w-full { width: 100%; }
.w-auto { width: auto; }
.w-screen { width: 100vw; }
.h-full { height: 100%; }
.h-auto { height: auto; }
.h-screen { height: 100vh; }
.min-h-screen { min-height: 100vh; }

/* --------------------------------------------------------------------------
   Text Utilities
   -------------------------------------------------------------------------- */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
.tracking-tight { letter-spacing: -1.2px; }

/* --------------------------------------------------------------------------
   Cursor Utilities
   -------------------------------------------------------------------------- */
.cursor-pointer { cursor: pointer; }
.cursor-default { cursor: default; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-grab { cursor: grab; }

/* --------------------------------------------------------------------------
   Transition Utilities
   -------------------------------------------------------------------------- */
.transition-all { transition: all 0.15s ease; }
.transition-colors { transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
.transition-transform { transition: transform 0.15s ease; }
.transition-opacity { transition: opacity 0.15s ease; }

/* Hover scale effect for interactive cards */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/utilities.css
git commit -m "feat: add utility classes and layout system"
```

---

## Task 6: Update Main CSS Entry Point

**Files:**
- Modify: `frontend/src/index.css` (replace content)
- Delete: `frontend/src/App.css` (remove Vite boilerplate)

- [ ] **Step 1: Replace index.css with Tailwind imports and design system**

```css
/* ==========================================================================
   Main Stylesheet Entry Point - TodoList App
   Pinterest-inspired Design System
   ========================================================================== */

/* Tailwind CSS v4 */
@import "tailwindcss";

/* Design System Layers */
@import "./styles/tokens.css";
@import "./styles/typography.css";
@import "./styles/components.css";
@import "./styles/utilities.css";

/* --------------------------------------------------------------------------
   Base Reset & Global Styles
   -------------------------------------------------------------------------- */

/* CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  line-height: 1.40;
  font-family: var(--sema-font-family-primary);
  background-color: var(--sema-color-background-primary);
  color: var(--sema-color-text-primary);
  min-height: 100vh;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

a {
  color: var(--sema-color-interactive-link);
  text-decoration: none;
  transition: color 0.15s ease;
}

a:hover {
  text-decoration: underline;
}

button {
  cursor: pointer;
}

/* Focus visible polyfill-safe styles */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--sema-color-border-focus);
  outline-offset: 2px;
}

/* --------------------------------------------------------------------------
   App Root
   -------------------------------------------------------------------------- */
#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --------------------------------------------------------------------------
   Selection Styling
   -------------------------------------------------------------------------- */
::selection {
  background-color: var(--base-color-brand-red);
  color: var(--base-color-text-white);
}

/* --------------------------------------------------------------------------
   Scrollbar Styling (WebKit)
   -------------------------------------------------------------------------- */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--base-color-surface-fog);
}

::-webkit-scrollbar-thumb {
  background: var(--base-color-text-silver);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--base-color-surface-hover-gray);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--base-color-text-silver) var(--base-color-surface-fog);
}
```

- [ ] **Step 2: Delete App.css (Vite boilerplate)**

Run: `rm frontend/src/App.css`

- [ ] **Step 3: Update App.tsx to be a minimal stub**

```tsx
import './index.css'

function App() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <div className="page-container">
          {/* App content will be added by feature development */}
        </div>
      </main>
    </div>
  )
}

export default App
```

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/App.tsx
git rm src/App.css
git commit -m "refactor: replace boilerplate with design system entry point"
```

---

## Task 7: Verify Build and Browser Preview

**Files:**
- None (verification only)

- [ ] **Step 1: Run build to verify no errors**

Run: `cd frontend && npm run build`

Expected: Build completes without errors

- [ ] **Step 2: Start dev server and verify**

Run: `cd frontend && npm run dev`

Expected: Dev server starts on port 5173

- [ ] **Step 3: Take browser snapshot to verify design**

Use Playwright or Chrome DevTools MCP to capture screenshot and verify:
- Page loads with warm white background
- Pin Sans font is applied
- Design tokens are working

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

**Plan complete and saved to `docs/superpowers/plans/2026-04-15-frontend-styling.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach would you prefer?