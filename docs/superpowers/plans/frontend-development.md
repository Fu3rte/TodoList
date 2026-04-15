# TodoList Frontend Business功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 TodoList 前端所有业务功能模块（认证、分类、标签、任务），不包含样式（样式文档单独编写）。

**Architecture:** Feature-based 架构。React 19 + TypeScript + Vite，使用 Tanstack Query 管理服务端状态，Zustand 管理客户端状态，Axios 处理 HTTP 请求，React Router DOM 处理路由。

**Tech Stack:** React 19, TypeScript, Vite 8, React Router DOM v6, Zustand, Tanstack Query, Axios

**Dependencies to install:**
```bash
react-router-dom@6 zustand @tanstack/react-query axios
```

---

## File Structure

```
frontend/src/
├── features/                    # Feature-based 架构
│   ├── auth/
│   │   ├── components/          # LoginForm, RegisterForm
│   │   ├── hooks/              # useLogin, useRegister
│   │   ├── services/           # authApi.ts
│   │   └── types/              # auth.ts
│   ├── tasks/
│   │   ├── components/         # TaskList, TaskItem, TaskForm, TaskFilters
│   │   ├── hooks/              # useTasks, useTaskMutations
│   │   ├── services/           # taskApi.ts
│   │   └── types/              # task.ts
│   ├── categories/
│   │   ├── components/         # CategoryTree, CategoryForm
│   │   ├── hooks/              # useCategories, useCategoryMutations
│   │   ├── services/           # categoryApi.ts
│   │   └── types/              # category.ts
│   └── tags/
│       ├── components/         # TagList, TagForm, TagBadge
│       ├── hooks/              # useTags, useTagMutations
│       ├── services/           # tagApi.ts
│       └── types/              # tag.ts
├── shared/
│   ├── components/             # Button, Input, Select, Modal, LoadingSpinner, EmptyState, ErrorMessage
│   ├── hooks/                  # useDebounce, useClickOutside
│   ├── lib/                    # axiosInstance, utils
│   └── types/                  # Common types (ApiResponse, Pagination)
├── stores/
│   ├── authStore.ts            # 认证状态
│   └── uiStore.ts              # UI 状态
├── pages/                      # 页面组件
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── TaskListPage.tsx
│   ├── TaskNewPage.tsx
│   ├── TaskDetailPage.tsx
│   ├── TaskEditPage.tsx
│   ├── CategoryManagePage.tsx
│   └── TagManagePage.tsx
├── routes/
│   ├── AppRoutes.tsx           # 路由声明
│   ├── ProtectedRoute.tsx      # 路由守卫
│   └── routes.ts               # 路由常量
├── App.tsx
└── main.tsx
```

---

## Task 1: 项目基础配置

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/src/shared/lib/axiosInstance.ts`
- Create: `frontend/src/shared/types/common.ts`
- Create: `frontend/src/stores/authStore.ts`
- Create: `frontend/src/stores/uiStore.ts`
- Create: `frontend/src/routes/routes.ts`
- Create: `frontend/src/routes/ProtectedRoute.tsx`
- Create: `frontend/src/routes/AppRoutes.tsx`
- Modify: `frontend/src/main.tsx`
- Modify: `frontend/src/App.tsx`

---

### Task 1.1: 安装依赖

- [ ] **Step 1: Install dependencies**

```bash
cd frontend && npm install react-router-dom@6 zustand @tanstack/react-query axios
```

- [ ] **Step 2: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "feat: add react-router-dom, zustand, tanstack-query, axios"
```

---

### Task 1.2: 创建通用类型

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

```bash
git add frontend/src/shared/types/common.ts
git commit -m "feat: add common types"
```

---

### Task 1.3: 创建 Axios 实例

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

```bash
git add frontend/src/shared/lib/axiosInstance.ts frontend/.env
git commit -m "feat: add axios instance with token interceptors"
```

---

### Task 1.4: 创建 Zustand Stores

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

```bash
git add frontend/src/stores/authStore.ts frontend/src/stores/uiStore.ts
git commit -m "feat: add zustand stores for auth and UI state"
```

---

### Task 1.5: 创建路由配置

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

```bash
git add frontend/src/routes/routes.ts frontend/src/routes/ProtectedRoute.tsx frontend/src/routes/AppRoutes.tsx
git commit -m "feat: add routing configuration"
```

---

### Task 1.6: 更新入口文件

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

```bash
git add frontend/src/main.tsx frontend/src/App.tsx
git commit -m "feat: update entry point with React Query and Router"
```

---

## Task 2: 认证模块 (Auth)

### Task 2.1: Auth 类型定义

**Files:**
- Create: `frontend/src/features/auth/types/auth.ts`

- [ ] **Step 1: Create frontend/src/features/auth/types/auth.ts**

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/auth/types/auth.ts
git commit -m "feat: add auth types"
```

---

### Task 2.2: Auth API 服务

**Files:**
- Create: `frontend/src/features/auth/services/authApi.ts`

- [ ] **Step 1: Create frontend/src/features/auth/services/authApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '../types/auth';

export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await axiosInstance.post<User>('/api/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthTokens> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    const response = await axiosInstance.post<AuthTokens>('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await axiosInstance.post<AuthTokens>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/api/auth/me');
    return response.data;
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/auth/services/authApi.ts
git commit -m "feat: add auth API service"
```

---

### Task 2.3: Auth Hooks

**Files:**
- Create: `frontend/src/features/auth/hooks/useLogin.ts`
- Create: `frontend/src/features/auth/hooks/useRegister.ts`
- Create: `frontend/src/features/auth/hooks/useAuth.ts`

- [ ] **Step 1: Create frontend/src/features/auth/hooks/useLogin.ts**

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../../../stores/authStore';
import type { LoginCredentials } from '../types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      const user = await authApi.getMe();
      setUser(user);
      navigate('/');
    },
  });
}
```

- [ ] **Step 2: Create frontend/src/features/auth/hooks/useRegister.ts**

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import type { RegisterData } from '../types/auth';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      navigate('/login');
    },
  });
}
```

- [ ] **Step 3: Create frontend/src/features/auth/hooks/useAuth.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../../../stores/authStore';

export function useAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/auth/hooks/useLogin.ts frontend/src/features/auth/hooks/useRegister.ts frontend/src/features/auth/hooks/useAuth.ts
git commit -m "feat: add auth hooks"
```

---

### Task 2.4: Auth 页面组件

**Files:**
- Create: `frontend/src/features/auth/components/LoginForm.tsx`
- Create: `frontend/src/features/auth/components/RegisterForm.tsx`
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/RegisterPage.tsx`

- [ ] **Step 1: Create frontend/src/features/auth/components/LoginForm.tsx**

```typescript
import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </button>
      {login.isError && <div>Login failed</div>}
    </form>
  );
}
```

- [ ] **Step 2: Create frontend/src/features/auth/components/RegisterForm.tsx**

```typescript
import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={register.isPending}>
        {register.isPending ? 'Registering...' : 'Register'}
      </button>
      {register.isError && <div>Registration failed</div>}
    </form>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/LoginPage.tsx**

```typescript
import { LoginForm } from '../features/auth/components/LoginForm';

export function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/src/pages/RegisterPage.tsx**

```typescript
import { RegisterForm } from '../features/auth/components/RegisterForm';

export function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <RegisterForm />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/auth/components/LoginForm.tsx frontend/src/features/auth/components/RegisterForm.tsx frontend/src/pages/LoginPage.tsx frontend/src/pages/RegisterPage.tsx
git commit -m "feat: add login and register pages"
```

---

## Task 3: 分类模块 (Categories)

### Task 3.1: Category 类型定义

**Files:**
- Create: `frontend/src/features/categories/types/category.ts`

- [ ] **Step 1: Create frontend/src/features/categories/types/category.ts**

```typescript
export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface CreateCategoryInput {
  name: string;
  parent_id?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  parent_id?: number | null;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/categories/types/category.ts
git commit -m "feat: add category types"
```

---

### Task 3.2: Category API 服务

**Files:**
- Create: `frontend/src/features/categories/services/categoryApi.ts`

- [ ] **Step 1: Create frontend/src/features/categories/services/categoryApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types/category';

export const categoryApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/api/categories');
    return response.data;
  },

  createCategory: async (data: CreateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/api/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: UpdateCategoryInput): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/api/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/categories/${id}`);
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/categories/services/categoryApi.ts
git commit -m "feat: add category API service"
```

---

### Task 3.3: Category Hooks

**Files:**
- Create: `frontend/src/features/categories/hooks/useCategories.ts`
- Create: `frontend/src/features/categories/hooks/useCreateCategory.ts`
- Create: `frontend/src/features/categories/hooks/useUpdateCategory.ts`
- Create: `frontend/src/features/categories/hooks/useDeleteCategory.ts`

- [ ] **Step 1: Create frontend/src/features/categories/hooks/useCategories.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  });
}
```

- [ ] **Step 2: Create frontend/src/features/categories/hooks/useCreateCategory.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';
import type { CreateCategoryInput } from '../types/category';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

- [ ] **Step 3: Create frontend/src/features/categories/hooks/useUpdateCategory.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';
import type { UpdateCategoryInput } from '../types/category';

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryInput }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

- [ ] **Step 4: Create frontend/src/features/categories/hooks/useDeleteCategory.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../services/categoryApi';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/categories/hooks/useCategories.ts frontend/src/features/categories/hooks/useCreateCategory.ts frontend/src/features/categories/hooks/useUpdateCategory.ts frontend/src/features/categories/hooks/useDeleteCategory.ts
git commit -m "feat: add category hooks"
```

---

### Task 3.4: Category 组件

**Files:**
- Create: `frontend/src/features/categories/components/CategoryTree.tsx`
- Create: `frontend/src/features/categories/components/CategoryItem.tsx`
- Create: `frontend/src/features/categories/components/CategoryForm.tsx`

- [ ] **Step 1: Create frontend/src/features/categories/components/CategoryItem.tsx**

```typescript
import { useState } from 'react';
import type { Category } from '../types/category';
import { useUpdateCategory } from '../hooks/useUpdateCategory';
import { useDeleteCategory } from '../hooks/useDeleteCategory';

interface CategoryItemProps {
  category: Category;
  onEdit?: (category: Category) => void;
}

export function CategoryItem({ category, onEdit }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleUpdate = () => {
    updateCategory.mutate(
      { id: category.id, data: { name } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (confirm('Delete this category?')) {
      deleteCategory.mutate(category.id);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span>{category.name}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      {category.children && category.children.length > 0 && (
        <div style={{ marginLeft: 20 }}>
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/features/categories/components/CategoryTree.tsx**

```typescript
import { useCategories } from '../hooks/useCategories';
import { CategoryItem } from './CategoryItem';
import type { Category } from '../types/category';

function buildTree(categories: Category[]): Category[] {
  const map = new Map<number, Category>();
  const roots: Category[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  map.forEach((cat) => {
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children!.push(cat);
    } else {
      roots.push(cat);
    }
  });

  return roots;
}

export function CategoryTree() {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading categories</div>;

  const tree = buildTree(categories || []);

  return (
    <div>
      <h2>Categories</h2>
      {tree.length === 0 ? (
        <div>No categories yet</div>
      ) : (
        tree.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/features/categories/components/CategoryForm.tsx**

```typescript
import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useCreateCategory } from '../hooks/useCreateCategory';

export function CategoryForm() {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | undefined>(undefined);
  const createCategory = useCreateCategory();
  const { data: categories } = useCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory.mutate(
      { name, parent_id: parentId },
      { onSuccess: () => {
        setName('');
        setParentId(undefined);
      }}
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        required
      />
      <select
        value={parentId ?? ''}
        onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">No parent</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={createCategory.isPending}>
        {createCategory.isPending ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create frontend/src/pages/CategoryManagePage.tsx**

```typescript
import { CategoryTree } from '../features/categories/components/CategoryTree';
import { CategoryForm } from '../features/categories/components/CategoryForm';

export function CategoryManagePage() {
  return (
    <div>
      <h1>Manage Categories</h1>
      <CategoryForm />
      <hr />
      <CategoryTree />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/categories/components/CategoryItem.tsx frontend/src/features/categories/components/CategoryTree.tsx frontend/src/features/categories/components/CategoryForm.tsx frontend/src/pages/CategoryManagePage.tsx
git commit -m "feat: add category components and page"
```

---

## Task 4: 标签模块 (Tags)

### Task 4.1: Tag 类型定义

**Files:**
- Create: `frontend/src/features/tags/types/tag.ts`

- [ ] **Step 1: Create frontend/src/features/tags/types/tag.ts**

```typescript
export interface Tag {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export interface CreateTagInput {
  name: string;
}

export interface UpdateTagInput {
  name?: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/tags/types/tag.ts
git commit -m "feat: add tag types"
```

---

### Task 4.2: Tag API 服务

**Files:**
- Create: `frontend/src/features/tags/services/tagApi.ts`

- [ ] **Step 1: Create frontend/src/features/tags/services/tagApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type { Tag, CreateTagInput, UpdateTagInput } from '../types/tag';

export const tagApi = {
  getTags: async (): Promise<Tag[]> => {
    const response = await axiosInstance.get<Tag[]>('/api/tags');
    return response.data;
  },

  createTag: async (data: CreateTagInput): Promise<Tag> => {
    const response = await axiosInstance.post<Tag>('/api/tags', data);
    return response.data;
  },

  updateTag: async (id: number, data: UpdateTagInput): Promise<Tag> => {
    const response = await axiosInstance.put<Tag>(`/api/tags/${id}`, data);
    return response.data;
  },

  deleteTag: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tags/${id}`);
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/tags/services/tagApi.ts
git commit -m "feat: add tag API service"
```

---

### Task 4.3: Tag Hooks

**Files:**
- Create: `frontend/src/features/tags/hooks/useTags.ts`
- Create: `frontend/src/features/tags/hooks/useCreateTag.ts`
- Create: `frontend/src/features/tags/hooks/useUpdateTag.ts`
- Create: `frontend/src/features/tags/hooks/useDeleteTag.ts`

- [ ] **Step 1: Create frontend/src/features/tags/hooks/useTags.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagApi.getTags(),
  });
}
```

- [ ] **Step 2: Create frontend/src/features/tags/hooks/useCreateTag.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';
import type { CreateTagInput } from '../types/tag';

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) => tagApi.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
```

- [ ] **Step 3: Create frontend/src/features/tags/hooks/useUpdateTag.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';
import type { UpdateTagInput } from '../types/tag';

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagInput }) =>
      tagApi.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
```

- [ ] **Step 4: Create frontend/src/features/tags/hooks/useDeleteTag.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tagApi } from '../services/tagApi';

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/features/tags/hooks/useTags.ts frontend/src/features/tags/hooks/useCreateTag.ts frontend/src/features/tags/hooks/useUpdateTag.ts frontend/src/features/tags/hooks/useDeleteTag.ts
git commit -m "feat: add tag hooks"
```

---

### Task 4.4: Tag 组件

**Files:**
- Create: `frontend/src/features/tags/components/TagItem.tsx`
- Create: `frontend/src/features/tags/components/TagList.tsx`
- Create: `frontend/src/features/tags/components/TagForm.tsx`
- Create: `frontend/src/features/tags/components/TagBadge.tsx`
- Create: `frontend/src/pages/TagManagePage.tsx`

- [ ] **Step 1: Create frontend/src/features/tags/components/TagItem.tsx**

```typescript
import { useState } from 'react';
import type { Tag } from '../types/tag';
import { useUpdateTag } from '../hooks/useUpdateTag';
import { useDeleteTag } from '../hooks/useDeleteTag';

interface TagItemProps {
  tag: Tag;
}

export function TagItem({ tag }: TagItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const handleUpdate = () => {
    updateTag.mutate(
      { id: tag.id, data: { name } },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const handleDelete = () => {
    if (confirm('Delete this tag?')) {
      deleteTag.mutate(tag.id);
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <span>{tag.name}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/features/tags/components/TagList.tsx**

```typescript
import { useTags } from '../hooks/useTags';
import { TagItem } from './TagItem';

export function TagList() {
  const { data: tags, isLoading, isError } = useTags();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tags</div>;

  return (
    <div>
      <h2>Tags</h2>
      {tags?.length === 0 ? (
        <div>No tags yet</div>
      ) : (
        tags?.map((tag) => <TagItem key={tag.id} tag={tag} />)
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/features/tags/components/TagForm.tsx**

```typescript
import { useState } from 'react';
import { useCreateTag } from '../hooks/useCreateTag';

export function TagForm() {
  const [name, setName] = useState('');
  const createTag = useCreateTag();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTag.mutate(
      { name },
      { onSuccess: () => setName('') }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tag name"
        required
      />
      <button type="submit" disabled={createTag.isPending}>
        {createTag.isPending ? 'Creating...' : 'Create Tag'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create frontend/src/features/tags/components/TagBadge.tsx**

```typescript
import type { Tag } from '../types/tag';

interface TagBadgeProps {
  tag: Tag;
}

export function TagBadge({ tag }: TagBadgeProps) {
  return <span>{tag.name}</span>;
}
```

- [ ] **Step 5: Create frontend/src/pages/TagManagePage.tsx**

```typescript
import { TagList } from '../features/tags/components/TagList';
import { TagForm } from '../features/tags/components/TagForm';

export function TagManagePage() {
  return (
    <div>
      <h1>Manage Tags</h1>
      <TagForm />
      <hr />
      <TagList />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/src/features/tags/components/TagItem.tsx frontend/src/features/tags/components/TagList.tsx frontend/src/features/tags/components/TagForm.tsx frontend/src/features/tags/components/TagBadge.tsx frontend/src/pages/TagManagePage.tsx
git commit -m "feat: add tag components and page"
```

---

## Task 5: 任务模块 (Tasks)

### Task 5.1: Task 类型定义

**Files:**
- Create: `frontend/src/features/tasks/types/task.ts`

- [ ] **Step 1: Create frontend/src/features/tasks/types/task.ts**

```typescript
import type { Category } from '../../categories/types/category';
import type { Tag } from '../../tags/types/tag';

export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  priority: Priority;
  due_date: string | null;
  is_completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  category: Category | null;
}

export interface TaskFilters {
  category_id?: number;
  tag_id?: number;
  is_completed?: boolean;
  page?: number;
  page_size?: number;
}

export interface TaskListResponse {
  total: number;
  page: number;
  page_size: number;
  tasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category_id?: number;
  priority?: Priority;
  due_date?: string;
  tag_ids?: number[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  category_id?: number | null;
  priority?: Priority;
  due_date?: string | null;
  tag_ids?: number[];
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/tasks/types/task.ts
git commit -m "feat: add task types"
```

---

### Task 5.2: Task API 服务

**Files:**
- Create: `frontend/src/features/tasks/services/taskApi.ts`

- [ ] **Step 1: Create frontend/src/features/tasks/services/taskApi.ts**

```typescript
import axiosInstance from '../../../shared/lib/axiosInstance';
import type {
  Task,
  TaskFilters,
  TaskListResponse,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

export const taskApi = {
  getTasks: async (filters?: TaskFilters): Promise<TaskListResponse> => {
    const response = await axiosInstance.get<TaskListResponse>('/api/tasks', { params: filters });
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get<Task>(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await axiosInstance.post<Task>('/api/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskInput): Promise<Task> => {
    const response = await axiosInstance.put<Task>(`/api/tasks/${id}`, data);
    return response.data;
  },

  toggleTask: async (id: number): Promise<{ is_completed: boolean }> => {
    const response = await axiosInstance.patch<{ is_completed: boolean }>(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/tasks/${id}`);
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/features/tasks/services/taskApi.ts
git commit -m "feat: add task API service"
```

---

### Task 5.3: Task Hooks

**Files:**
- Create: `frontend/src/features/tasks/hooks/useTasks.ts`
- Create: `frontend/src/features/tasks/hooks/useTask.ts`
- Create: `frontend/src/features/tasks/hooks/useCreateTask.ts`
- Create: `frontend/src/features/tasks/hooks/useUpdateTask.ts`
- Create: `frontend/src/features/tasks/hooks/useToggleTask.ts`
- Create: `frontend/src/features/tasks/hooks/useDeleteTask.ts`

- [ ] **Step 1: Create frontend/src/features/tasks/hooks/useTasks.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';
import type { TaskFilters } from '../types/task';

export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskApi.getTasks(filters),
  });
}
```

- [ ] **Step 2: Create frontend/src/features/tasks/hooks/useTask.ts**

```typescript
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
  });
}
```

- [ ] **Step 3: Create frontend/src/features/tasks/hooks/useCreateTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { CreateTaskInput } from '../types/task';

export function useCreateTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateTaskInput) => taskApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });
}
```

- [ ] **Step 4: Create frontend/src/features/tasks/hooks/useUpdateTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';
import type { UpdateTaskInput } from '../types/task';

export function useUpdateTask(id: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateTaskInput) => taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate(`/tasks/${id}`);
    },
  });
}
```

- [ ] **Step 5: Create frontend/src/features/tasks/hooks/useToggleTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/taskApi';

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.toggleTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousData = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: { tasks: Array<{ id: number; is_completed: boolean }> } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === id ? { ...t, is_completed: !t.is_completed } : t
          ),
        };
      });

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['tasks'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
```

- [ ] **Step 6: Create frontend/src/features/tasks/hooks/useDeleteTask.ts**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../services/taskApi';

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/');
    },
  });
}
```

- [ ] **Step 7: Commit**

```bash
git add frontend/src/features/tasks/hooks/useTasks.ts frontend/src/features/tasks/hooks/useTask.ts frontend/src/features/tasks/hooks/useCreateTask.ts frontend/src/features/tasks/hooks/useUpdateTask.ts frontend/src/features/tasks/hooks/useToggleTask.ts frontend/src/features/tasks/hooks/useDeleteTask.ts
git commit -m "feat: add task hooks"
```

---

### Task 5.4: Task 组件

**Files:**
- Create: `frontend/src/features/tasks/components/TaskItem.tsx`
- Create: `frontend/src/features/tasks/components/TaskList.tsx`
- Create: `frontend/src/features/tasks/components/TaskForm.tsx`
- Create: `frontend/src/features/tasks/components/TaskFilters.tsx`
- Create: `frontend/src/features/tasks/components/TaskPriorityBadge.tsx`
- Create: `frontend/src/features/tasks/components/TaskToggle.tsx`
- Create: `frontend/src/features/tasks/components/TaskPagination.tsx`

- [ ] **Step 1: Create frontend/src/features/tasks/components/TaskPriorityBadge.tsx**

```typescript
import type { Priority } from '../types/task';

interface TaskPriorityBadgeProps {
  priority: Priority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const colors: Record<Priority, string> = {
    high: 'red',
    medium: 'yellow',
    low: 'green',
  };

  return <span style={{ color: colors[priority] }}>{priority}</span>;
}
```

- [ ] **Step 2: Create frontend/src/features/tasks/components/TaskToggle.tsx**

```typescript
import { useToggleTask } from '../hooks/useToggleTask';

interface TaskToggleProps {
  id: number;
  isCompleted: boolean;
}

export function TaskToggle({ id, isCompleted }: TaskToggleProps) {
  const toggleTask = useToggleTask();

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      onChange={() => toggleTask.mutate(id)}
      disabled={toggleTask.isPending}
    />
  );
}
```

- [ ] **Step 3: Create frontend/src/features/tasks/components/TaskItem.tsx**

```typescript
import { Link } from 'react-router-dom';
import type { Task } from '../types/task';
import { TaskToggle } from './TaskToggle';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TagBadge } from '../../tags/components/TagBadge';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div>
      <TaskToggle id={task.id} isCompleted={task.is_completed} />
      <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      <TaskPriorityBadge priority={task.priority} />
      {task.category && <span>{task.category.name}</span>}
      {task.tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/src/features/tasks/components/TaskFilters.tsx**

```typescript
import type { TaskFilters } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  return (
    <div>
      <select
        value={filters.category_id ?? ''}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            category_id: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      >
        <option value="">All Categories</option>
      </select>
      <select
        value={filters.is_completed ?? ''}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            is_completed: e.target.value === '' ? undefined : e.target.value === 'true',
          })
        }
      >
        <option value="">All Status</option>
        <option value="false">Active</option>
        <option value="true">Completed</option>
      </select>
    </div>
  );
}
```

- [ ] **Step 5: Create frontend/src/features/tasks/components/TaskPagination.tsx**

```typescript
interface TaskPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TaskPagination({ page, pageSize, total, onPageChange }: TaskPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
}
```

- [ ] **Step 6: Create frontend/src/features/tasks/components/TaskList.tsx**

```typescript
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import type { TaskFilters } from '../types/task';
import { TaskItem } from './TaskItem';
import { TaskFilters } from './TaskFilters';
import { TaskPagination } from './TaskPagination';

export function TaskList() {
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, isError } = useTasks(filters);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tasks</div>;

  return (
    <div>
      <h1>Tasks</h1>
      <Link to="/tasks/new">Create New Task</Link>
      <TaskFilters filters={filters} onFiltersChange={setFilters} />
      {data?.tasks.length === 0 ? (
        <div>No tasks found</div>
      ) : (
        data?.tasks.map((task) => <TaskItem key={task.id} task={task} />)
      )}
      {data && (
        <TaskPagination
          page={data.page}
          pageSize={data.page_size}
          total={data.total}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 7: Create frontend/src/features/tasks/components/TaskForm.tsx**

```typescript
import { useState, useEffect } from 'react';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTags } from '../../tags/hooks/useTags';
import type { CreateTaskInput, Priority } from '../types/task';

interface TaskFormProps {
  initialData?: Partial<CreateTaskInput>;
  onSubmit: (data: CreateTaskInput) => void;
  isPending: boolean;
}

export function TaskForm({ initialData, onSubmit, isPending }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.category_id);
  const [priority, setPriority] = useState<Priority>(initialData?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initialData?.due_date ?? '');
  const [tagIds, setTagIds] = useState<number[]>(initialData?.tag_ids ?? []);
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      category_id: categoryId,
      priority,
      due_date: dueDate || undefined,
      tag_ids: tagIds.length > 0 ? tagIds : undefined,
    });
  };

  const toggleTag = (tagId: number) => {
    setTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
      </div>
      <div>
        <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">No category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <span>Tags:</span>
        {tags?.map((tag) => (
          <label key={tag.id}>
            <input
              type="checkbox"
              checked={tagIds.includes(tag.id)}
              onChange={() => toggleTag(tag.id)}
            />
            {tag.name}
          </label>
        ))}
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add frontend/src/features/tasks/components/TaskPriorityBadge.tsx frontend/src/features/tasks/components/TaskToggle.tsx frontend/src/features/tasks/components/TaskItem.tsx frontend/src/features/tasks/components/TaskFilters.tsx frontend/src/features/tasks/components/TaskPagination.tsx frontend/src/features/tasks/components/TaskList.tsx frontend/src/features/tasks/components/TaskForm.tsx
git commit -m "feat: add task components"
```

---

### Task 5.5: Task 页面

**Files:**
- Create: `frontend/src/pages/TaskListPage.tsx`
- Create: `frontend/src/pages/TaskNewPage.tsx`
- Create: `frontend/src/pages/TaskDetailPage.tsx`
- Create: `frontend/src/pages/TaskEditPage.tsx`

- [ ] **Step 1: Create frontend/src/pages/TaskListPage.tsx**

```typescript
import { TaskList } from '../features/tasks/components/TaskList';

export function TaskListPage() {
  return <TaskList />;
}
```

- [ ] **Step 2: Create frontend/src/pages/TaskNewPage.tsx**

```typescript
import { useCreateTask } from '../features/tasks/hooks/useCreateTask';
import { TaskForm } from '../features/tasks/components/TaskForm';
import type { CreateTaskInput } from '../features/tasks/types/task';

export function TaskNewPage() {
  const createTask = useCreateTask();

  return (
    <div>
      <h1>Create New Task</h1>
      <TaskForm onSubmit={(data: CreateTaskInput) => createTask.mutate(data)} isPending={createTask.isPending} />
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/TaskDetailPage.tsx**

```typescript
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTask';
import { useDeleteTask } from '../features/tasks/hooks/useDeleteTask';
import { TaskPriorityBadge } from '../features/tasks/components/TaskPriorityBadge';
import { TagBadge } from '../features/tags/components/TagBadge';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const { data: task, isLoading, isError } = useTask(taskId);
  const deleteTask = useDeleteTask();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !task) return <div>Task not found</div>;

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask.mutate(taskId);
    }
  };

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Priority: <TaskPriorityBadge priority={task.priority} /></p>
      {task.category && <p>Category: {task.category.name}</p>}
      {task.due_date && <p>Due: {new Date(task.due_date).toLocaleString()}</p>}
      <div>
        Tags: {task.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
      </div>
      <Link to={`/tasks/${taskId}/edit`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

- [ ] **Step 4: Create frontend/src/pages/TaskEditPage.tsx**

```typescript
import { useParams } from 'react-router-dom';
import { useTask } from '../features/tasks/hooks/useTask';
import { useUpdateTask } from '../features/tasks/hooks/useUpdateTask';
import { TaskForm } from '../features/tasks/components/TaskForm';
import type { CreateTaskInput } from '../features/tasks/types/task';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const { data: task, isLoading } = useTask(taskId);
  const updateTask = useUpdateTask(taskId);

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div>
      <h1>Edit Task</h1>
      <TaskForm
        initialData={{
          title: task.title,
          description: task.description ?? undefined,
          category_id: task.category_id ?? undefined,
          priority: task.priority,
          due_date: task.due_date ?? undefined,
          tag_ids: task.tags.map((t) => t.id),
        }}
        onSubmit={(data: CreateTaskInput) => updateTask.mutate(data)}
        isPending={updateTask.isPending}
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/TaskListPage.tsx frontend/src/pages/TaskNewPage.tsx frontend/src/pages/TaskDetailPage.tsx frontend/src/pages/TaskEditPage.tsx
git commit -m "feat: add task pages"
```

---

## Task 6: 共享组件

**Files:**
- Create: `frontend/src/shared/components/LoadingSpinner.tsx`
- Create: `frontend/src/shared/components/EmptyState.tsx`
- Create: `frontend/src/shared/components/ErrorMessage.tsx`
- Create: `frontend/src/shared/hooks/useDebounce.ts`
- Create: `frontend/src/shared/hooks/useClickOutside.ts`

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

```bash
git add frontend/src/shared/components/LoadingSpinner.tsx frontend/src/shared/components/EmptyState.tsx frontend/src/shared/components/ErrorMessage.tsx frontend/src/shared/hooks/useDebounce.ts frontend/src/shared/hooks/useClickOutside.ts
git commit -m "feat: add shared components and hooks"
```

---

## Task 7: 集成验证

- [ ] **Step 1: Run dev server and verify**

```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Verify all pages render without errors**

- [ ] **Step 3: Commit final changes**

```bash
git add -A
git commit -m "feat: complete frontend business functionality"
```

---

**Plan complete and saved to `docs/superpowers/plans/frontend-development.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
