# Task 1: Project Setup

> **For agentic workers:** Implement this task step-by-step using superpowers:executing-plans.

**Goal:** 配置项目基础：安装依赖、创建通用类型、Axios 实例、Zustand Stores、路由配置、更新入口文件。

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/shared/types/common.ts`
- Create: `frontend/src/shared/lib/axiosInstance.ts`
- Create: `frontend/.env`
- Create: `frontend/src/stores/authStore.ts`
- Create: `frontend/src/stores/uiStore.ts`
- Create: `frontend/src/routes/routes.ts`
- Create: `frontend/src/routes/ProtectedRoute.tsx`
- Create: `frontend/src/routes/AppRoutes.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`

---

## Task 1.1: 安装依赖

- [ ] **Step 1: Install dependencies**

Run: `cd frontend && npm install react-router-dom@6 zustand @tanstack/react-query axios`

Expected: Package.json updated with react-router-dom, zustand, @tanstack/react-query, axios

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "feat: add react-router-dom, zustand, tanstack-query, axios"
```

---

## Task 1.2: 创建通用类型

- [ ] **Step 1: Create frontend/src/shared/types/common.ts**

```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}
```

- [ ] **Step 2: Commit**

Run:
```bash
git add frontend/src/shared/types/common.ts
git commit -m "feat: add common types"
```

---

## Task 1.3: 创建 Axios 实例

- [ ] **Step 1: Create frontend/src/shared/lib/axiosInstance.ts**

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refresh_token: refreshToken });
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

- [ ] **Step 2: Create frontend/.env**

```env
VITE_API_URL=http://localhost:8000
```

- [ ] **Step 3: Commit**

Run:
```bash
git add frontend/src/shared/lib/axiosInstance.ts frontend/.env
git commit -m "feat: add axios instance with token interceptors"
```

---

## Task 1.4: 创建 Zustand Stores

- [ ] **Step 1: Create frontend/src/stores/authStore.ts**

```typescript
import { create } from 'zustand';
import type { User } from '../../features/auth/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, isAuthenticated: false });
  },
}));
```

- [ ] **Step 2: Create frontend/src/stores/uiStore.ts**

```typescript
import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
```

- [ ] **Step 3: Commit**

Run:
```bash
git add frontend/src/stores/authStore.ts frontend/src/stores/uiStore.ts
git commit -m "feat: add zustand stores for auth and UI state"
```

---

## Task 1.5: 创建路由配置

- [ ] **Step 1: Create frontend/src/routes/routes.ts**

```typescript
export const AppRoutes = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  TASKS: '/',
  TASK_NEW: '/tasks/new',
  TASK_DETAIL: '/tasks/:id',
  TASK_EDIT: '/tasks/:id/edit',
  CATEGORIES: '/categories',
  TAGS: '/tags',
} as const;
```

- [ ] **Step 2: Create frontend/src/routes/ProtectedRoute.tsx**

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

- [ ] **Step 3: Create frontend/src/routes/AppRoutes.tsx**

```typescript
import { createBrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskNewPage } from '../pages/TaskNewPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { TaskEditPage } from '../pages/TaskEditPage';
import { CategoryManagePage } from '../pages/CategoryManagePage';
import { TagManagePage } from '../pages/TagManagePage';

export const router = createBrowserRouter([
  {
    path: AppRoutes.LOGIN,
    element: <LoginPage />,
  },
  {
    path: AppRoutes.REGISTER,
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: AppRoutes.TASKS,
        element: <TaskListPage />,
      },
      {
        path: AppRoutes.TASK_NEW,
        element: <TaskNewPage />,
      },
      {
        path: AppRoutes.TASK_DETAIL,
        element: <TaskDetailPage />,
      },
      {
        path: AppRoutes.TASK_EDIT,
        element: <TaskEditPage />,
      },
      {
        path: AppRoutes.CATEGORIES,
        element: <CategoryManagePage />,
      },
      {
        path: AppRoutes.TAGS,
        element: <TagManagePage />,
      },
    ],
  },
]);
```

- [ ] **Step 4: Commit**

Run:
```bash
git add frontend/src/routes/routes.ts frontend/src/routes/ProtectedRoute.tsx frontend/src/routes/AppRoutes.tsx
git commit -m "feat: add routing configuration"
```

---

## Task 1.6: 更新入口文件

- [ ] **Step 1: Modify frontend/src/main.tsx**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

- [ ] **Step 2: Modify frontend/src/App.tsx**

```typescript
function App() {
  return null;
}

export default App;
```

- [ ] **Step 3: Commit**

Run:
```bash
git add frontend/src/main.tsx frontend/src/App.tsx
git commit -m "feat: update entry point with React Query and Router"
```
