# Task 3: Create Typography CSS

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Files:**
- Create: `frontend/src/styles/typography.css`

---

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
