# Task 6: Shared Components

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Goal:** 创建共享组件和工具 Hooks：LoadingSpinner、EmptyState、ErrorMessage、useDebounce、useClickOutside。

**Files:**
- Create: `frontend/src/shared/components/LoadingSpinner.tsx`
- Create: `frontend/src/shared/components/EmptyState.tsx`
- Create: `frontend/src/shared/components/ErrorMessage.tsx`
- Create: `frontend/src/shared/hooks/useDebounce.ts`
- Create: `frontend/src/shared/hooks/useClickOutside.ts`

---

- [ ] **Step 1: Create frontend/src/shared/components/LoadingSpinner.tsx**

```typescript
export function LoadingSpinner() {
  return <div>Loading...</div>;
}
```

- [ ] **Step 2: Create frontend/src/shared/components/EmptyState.tsx**

```typescript
interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return <div>{message}</div>;
}
```

- [ ] **Step 3: Create frontend/src/shared/components/ErrorMessage.tsx**

```typescript
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <div style={{ color: 'red' }}>{message}</div>;
}
```

- [ ] **Step 4: Create frontend/src/shared/hooks/useDebounce.ts**

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

- [ ] **Step 5: Create frontend/src/shared/hooks/useClickOutside.ts**

```typescript
import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
```

- [ ] **Step 6: Commit**

Run:
```bash
git add frontend/src/shared/components/LoadingSpinner.tsx frontend/src/shared/components/EmptyState.tsx frontend/src/shared/components/ErrorMessage.tsx frontend/src/shared/hooks/useDebounce.ts frontend/src/shared/hooks/useClickOutside.ts
git commit -m "feat: add shared components and hooks"
```
