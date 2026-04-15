# Task 6: Update Main CSS Entry Point

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Files:**
- Modify: `frontend/src/index.css` (replace content)
- Delete: `frontend/src/App.css` (remove Vite boilerplate)

---

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
