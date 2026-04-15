# TodoList 前端业务功能开发文档

**日期**: 2026-04-15
**项目名称**: TodoList
**版本**: v1.0
**依赖文档**: [integration-spec.md](../docs/integration-spec.md)、[requirements.md](../docs/requirements.md)

---

## 一、项目架构

### 1.1 技术栈

| 项目 | 技术选型 |
|------|----------|
| 框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 路由 | React Router DOM v6 |
| 状态管理 | Zustand |
| 数据请求 | Tanstack Query + Axios |
| UI 样式 | Tailwind CSS + shadcn |
| 动画 | GSAP |

### 1.2 目录结构

```
frontend/src/
├── features/                    # Feature-based 架构
│   ├── auth/                    # 认证功能
│   │   ├── components/          # AuthForm, LoginForm, RegisterForm
│   │   ├── hooks/              # useAuth, useLogin, useRegister
│   │   ├── services/           # authApi.ts (Axios 实例)
│   │   └── types/              # Auth types
│   ├── tasks/                   # 任务管理功能
│   │   ├── components/         # TaskList, TaskItem, TaskForm, TaskFilters
│   │   ├── hooks/              # useTasks, useTaskMutations
│   │   ├── services/           # taskApi.ts
│   │   └── types/              # Task types
│   ├── categories/              # 分类管理功能
│   │   ├── components/         # CategoryTree, CategoryForm, CategoryItem
│   │   ├── hooks/              # useCategories, useCategoryMutations
│   │   ├── services/           # categoryApi.ts
│   │   └── types/              # Category types
│   └── tags/                    # 标签管理功能
│       ├── components/         # TagList, TagForm, TagBadge
│       ├── hooks/              # useTags, useTagMutations
│       ├── services/           # tagApi.ts
│       └── types/              # Tag types
├── shared/                      # 共享资源
│   ├── components/             # Button, Input, Modal, Dropdown, LoadingSpinner
│   ├── hooks/                  # useDebounce, useClickOutside, useMediaQuery
│   ├── lib/                    # axiosInstance, utils, constants
│   └── types/                  # Common types (ApiResponse, Pagination)
├── routes/                      # 路由配置
│   ├── AppRoutes.tsx           # 路由声明
│   ├── ProtectedRoute.tsx      # 路由守卫
│   └── routes.ts               # 路由常量
├── stores/                      # Zustand stores
│   ├── authStore.ts            # 认证状态
│   └── uiStore.ts              # UI 状态（侧边栏、模态框）
├── App.tsx
└── main.tsx
```

---

## 二、API 层设计

### 2.1 Axios 实例配置

**文件**: `frontend/src/shared/lib/axiosInstance.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：注入 Token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理 Token 刷新
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

### 2.2 API 服务模块

#### 认证 API

**文件**: `frontend/src/features/auth/services/authApi.ts`

| 方法 | 路径 | 参数 | 返回 |
|------|------|------|------|
| POST | `/api/auth/register` | `{username, email, password}` | `User` |
| POST | `/api/auth/login` | FormData `{username, password}` | `{access_token, refresh_token, token_type}` |
| POST | `/api/auth/refresh` | `{refresh_token}` | `{access_token, refresh_token}` |
| GET | `/api/auth/me` | - | `User` |

#### 分类 API

**文件**: `frontend/src/features/categories/services/categoryApi.ts`

| 方法 | 路径 | 参数 | 返回 |
|------|------|------|------|
| GET | `/api/categories` | - | `Category[]` |
| POST | `/api/categories` | `{name, parent_id?}` | `Category` |
| PUT | `/api/categories/{id}` | `{name, parent_id?}` | `Category` |
| DELETE | `/api/categories/{id}` | - | `204` |

#### 标签 API

**文件**: `frontend/src/features/tags/services/tagApi.ts`

| 方法 | 路径 | 参数 | 返回 |
|------|------|------|------|
| GET | `/api/tags` | - | `Tag[]` |
| POST | `/api/tags` | `{name}` | `Tag` |
| PUT | `/api/tags/{id}` | `{name}` | `Tag` |
| DELETE | `/api/tags/{id}` | - | `204` |

#### 任务 API

**文件**: `frontend/src/features/tasks/services/taskApi.ts`

| 方法 | 路径 | 参数 | 返回 |
|------|------|------|------|
| GET | `/api/tasks` | `?category_id=&tag_id=&is_completed=&page=&page_size=` | `{total, page, page_size, tasks}` |
| POST | `/api/tasks` | `{title, description?, category_id?, priority?, due_date?, tag_ids?}` | `Task` |
| GET | `/api/tasks/{id}` | - | `Task` |
| PUT | `/api/tasks/{id}` | `{title?, description?, category_id?, priority?, due_date?, tag_ids?}` | `Task` |
| PATCH | `/api/tasks/{id}/toggle` | - | `{is_completed}` |
| DELETE | `/api/tasks/{id}` | - | `204` |

---

## 三、数据模型

### 3.1 类型定义

**文件**: `frontend/src/features/auth/types/auth.ts`

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

**文件**: `frontend/src/features/categories/types/category.ts`

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
```

**文件**: `frontend/src/features/tags/types/tag.ts`

```typescript
export interface Tag {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}
```

**文件**: `frontend/src/features/tasks/types/task.ts`

```typescript
import type { Category } from '../categories/types/category';
import type { Tag } from '../tags/types/tag';

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
```

---

## 四、功能模块

### 4.1 认证模块 (auth)

#### 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/login` | LoginPage | 登录页 |
| `/register` | RegisterPage | 注册页 |

#### 组件结构

```
features/auth/
├── components/
│   ├── LoginForm.tsx          # 登录表单
│   ├── RegisterForm.tsx       # 注册表单
│   └── AuthLayout.tsx         # 认证布局容器
├── hooks/
│   ├── useLogin.ts            # 登录 mutation
│   └── useRegister.ts         # 注册 mutation
├── services/authApi.ts
└── types/auth.ts
```

#### 核心逻辑

1. **登录流程**:
   - 用户输入用户名/密码
   - 调用 `POST /api/auth/login` (FormData)
   - 存储返回的 `access_token` 和 `refresh_token` 到 localStorage
   - 更新 authStore 状态
   - 跳转到首页

2. **注册流程**:
   - 用户输入用户名/邮箱/密码
   - 调用 `POST /api/auth/register`
   - 注册成功后跳转到登录页

3. **Token 刷新**:
   - Axios 拦截器自动处理 401 响应
   - 调用 `POST /api/auth/refresh` 刷新 token
   - 重试原请求

4. **登出**:
   - 清除 localStorage 中的 token
   - 重置 authStore 状态
   - 跳转到登录页

#### AuthStore (Zustand)

```typescript
// frontend/src/stores/authStore.ts
import { create } from 'zustand';
import type { User } from '../features/auth/types/auth';

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

### 4.2 分类模块 (categories)

#### 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/categories` | CategoryManagePage | 分类管理页 |

#### 组件结构

```
features/categories/
├── components/
│   ├── CategoryTree.tsx       # 分类树形列表
│   ├── CategoryItem.tsx       # 单个分类项
│   ├── CategoryForm.tsx       # 新建/编辑分类表单
│   └── CategoryList.tsx       # 分类列表容器
├── hooks/
│   ├── useCategories.ts       # 获取分类列表 query
│   ├── useCreateCategory.ts   # 创建 mutation
│   ├── useUpdateCategory.ts   # 更新 mutation
│   └── useDeleteCategory.ts   # 删除 mutation
├── services/categoryApi.ts
└── types/category.ts
```

#### 核心逻辑

1. **获取分类树**:
   - 调用 `GET /api/categories`
   - 将扁平数据转换为树形结构 (parent_id → children)
   - Tanstack Query 缓存管理

2. **创建分类**:
   - 调用 `POST /api/categories`
   - 支持指定 `parent_id` 创建子分类
   - 创建后自动 invalidate categories query

3. **编辑分类**:
   - 调用 `PUT /api/categories/{id}`
   - 支持修改名称和父分类

4. **删除分类**:
   - 调用 `DELETE /api/categories/{id}`
   - 删除后自动 invalidate categories query

#### Tanstack Query Hooks

```typescript
// useCategories.ts
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  });
}

// useCreateCategory.ts
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

### 4.3 标签模块 (tags)

#### 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/tags` | TagManagePage | 标签管理页 |

#### 组件结构

```
features/tags/
├── components/
│   ├── TagList.tsx            # 标签列表
│   ├── TagItem.tsx            # 单个标签项
│   ├── TagForm.tsx            # 新建/编辑标签表单
│   └── TagBadge.tsx           # 标签徽章（用于任务展示）
├── hooks/
│   ├── useTags.ts             # 获取标签列表 query
│   ├── useCreateTag.ts        # 创建 mutation
│   ├── useUpdateTag.ts        # 更新 mutation
│   └── useDeleteTag.ts        # 删除 mutation
├── services/tagApi.ts
└── types/tag.ts
```

#### 核心逻辑

1. **获取标签**: `GET /api/tags` → Tanstack Query 缓存
2. **创建标签**: `POST /api/tags` → invalidate tags query
3. **编辑标签**: `PUT /api/tags/{id}` → invalidate tags query
4. **删除标签**: `DELETE /api/tags/{id}` → invalidate tags query

### 4.4 任务模块 (tasks)

#### 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | TaskListPage | 任务列表页 |
| `/tasks/new` | TaskNewPage | 新建任务页 |
| `/tasks/:id` | TaskDetailPage | 任务详情页 |
| `/tasks/:id/edit` | TaskEditPage | 编辑任务页 |

#### 组件结构

```
features/tasks/
├── components/
│   ├── TaskList.tsx           # 任务列表容器
│   ├── TaskItem.tsx           # 单个任务项
│   ├── TaskForm.tsx           # 新建/编辑任务表单
│   ├── TaskFilters.tsx        # 筛选器（分类/标签/状态）
│   ├── TaskPriorityBadge.tsx  # 优先级徽章
│   ├── TaskToggle.tsx         # 完成状态切换
│   └── TaskPagination.tsx    # 分页组件
├── hooks/
│   ├── useTasks.ts            # 获取任务列表 query
│   ├── useTask.ts             # 获取单个任务 query
│   ├── useCreateTask.ts       # 创建 mutation
│   ├── useUpdateTask.ts       # 更新 mutation
│   ├── useToggleTask.ts       # 切换完成状态 mutation
│   └── useDeleteTask.ts       # 删除 mutation
├── services/taskApi.ts
└── types/task.ts
```

#### 核心逻辑

1. **获取任务列表**:
   - 调用 `GET /api/tasks` 支持分页和筛选
   - 查询参数: `category_id`, `tag_id`, `is_completed`, `page`, `page_size`
   - Tanstack Query 缓存，支持 filters 作为 queryKey 一部分实现自动刷新

2. **创建任务**:
   - 调用 `POST /api/tasks`
   - 支持字段: `title`, `description`, `category_id`, `priority`, `due_date`, `tag_ids`
   - 创建成功后跳转到任务列表

3. **更新任务**:
   - 调用 `PUT /api/tasks/{id}`
   - 支持部分更新

4. **切换完成状态**:
   - 调用 `PATCH /api/tasks/{id}/toggle`
   - 返回 `{is_completed}` 布尔值
   - 更新本地 cache 而非重新 fetch

5. **删除任务**:
   - 调用 `DELETE /api/tasks/{id}`
   - invalidate tasks query

#### Tanstack Query 实现

```typescript
// useTasks.ts
export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskApi.getTasks(filters),
  });
}

// useToggleTask.ts
export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => taskApi.toggleTask(taskId),
    onSuccess: (data, taskId) => {
      // Optimistic update: 更新 cache 中的任务状态
      queryClient.setQueryData(['tasks'], (old: TaskListResponse | undefined) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) =>
            t.id === taskId ? { ...t, is_completed: data.is_completed } : t
          ),
        };
      });
    },
  });
}
```

---

## 五、路由设计

### 5.1 路由配置

**文件**: `frontend/src/routes/routes.ts`

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

### 5.2 路由守卫

**文件**: `frontend/src/routes/ProtectedRoute.tsx`

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

### 5.3 路由声明

**文件**: `frontend/src/routes/AppRoutes.tsx`

```typescript
import { createBrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../features/auth/components/AuthLayout';
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

---

## 六、共享组件

### 6.1 通用组件清单

| 组件 | 文件 | 说明 |
|------|------|------|
| Button | `shared/components/Button.tsx` | 按钮组件，支持 variant (primary/secondary/destructive) |
| Input | `shared/components/Input.tsx` | 输入框组件 |
| Select | `shared/components/Select.tsx` | 选择器组件 |
| Modal | `shared/components/Modal.tsx` | 模态框组件 |
| Dropdown | `shared/components/Dropdown.tsx` | 下拉菜单组件 |
| LoadingSpinner | `shared/components/LoadingSpinner.tsx` | 加载动画 |
| EmptyState | `shared/components/EmptyState.tsx` | 空状态提示 |
| ErrorMessage | `shared/components/ErrorMessage.tsx` | 错误消息展示 |

### 6.2 通用 Hooks

| Hook | 文件 | 说明 |
|------|------|------|
| useDebounce | `shared/hooks/useDebounce.ts` | 防抖 Hook |
| useClickOutside | `shared/hooks/useClickOutside.ts` | 点击外部检测 |
| useMediaQuery | `shared/hooks/useMediaQuery.ts` | 媒体查询 Hook |

---

## 七、环境配置

### 7.1 前端环境变量

**文件**: `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=TodoList
```

### 7.2 Vite 代理配置

**文件**: `frontend/vite.config.ts`

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 八、开发任务清单

### 阶段一：基础搭建

- [ ] 初始化项目结构 (features/shared/routes/stores)
- [ ] 配置 Tailwind CSS + shadcn/ui
- [ ] 配置 Axios 实例和 API 层
- [ ] 配置 React Router 和路由守卫
- [ ] 配置 Zustand authStore

### 阶段二：认证模块

- [ ] 实现 auth types 和 API
- [ ] 实现 LoginForm 组件
- [ ] 实现 RegisterForm 组件
- [ ] 实现 LoginPage 和 RegisterPage
- [ ] 实现 Token 刷新逻辑

### 阶段三：分类模块

- [ ] 实现 category types 和 API
- [ ] 实现 CategoryTree 组件
- [ ] 实现 CategoryForm 组件
- [ ] 实现 CategoryManagePage
- [ ] 实现 Tanstack Query hooks

### 阶段四：标签模块

- [ ] 实现 tag types 和 API
- [ ] 实现 TagList 组件
- [ ] 实现 TagForm 组件
- [ ] 实现 TagBadge 组件
- [ ] 实现 TagManagePage

### 阶段五：任务模块

- [ ] 实现 task types 和 API
- [ ] 实现 TaskList 组件
- [ ] 实现 TaskItem 组件
- [ ] 实现 TaskForm 组件
- [ ] 实现 TaskFilters 组件
- [ ] 实现 TaskListPage (含分页)
- [ ] 实现 TaskNewPage / TaskEditPage / TaskDetailPage

### 阶段六：集成与交互

- [ ] 实现 GSAP 动画集成
- [ ] 路由守卫与页面跳转
- [ ] 全局错误处理
- [ ] Loading/Empty 状态处理

---

## 九、与后端对接要点

### 9.1 认证对接

1. 登录使用 FormData 格式 (`application/x-www-form-urlencoded`)
2. 存储 Access Token 和 Refresh Token 到 localStorage
3. 401 响应自动触发 Token 刷新
4. 刷新失败清除 Token 并跳转登录页

### 9.2 数据验证

| 场景 | 后端状态码 | 前端处理 |
|------|-----------|----------|
| 参数错误 | 400 | 显示 detail 错误信息 |
| 未授权 | 401 | 刷新 Token 或跳转登录 |
| 禁止访问 | 403 | 显示无权限提示 |
| 资源不存在 | 404 | 显示不存在提示 |
| 验证错误 | 422 | 显示验证详情 |

### 9.3 日期格式

- 前后端使用 ISO 8601 格式 (`2026-04-15T10:30:00Z`)
- 前端展示时转换为本地时间格式

### 9.4 分页处理

- 默认 page_size: 20
- 分页参数: `page`, `page_size`
- 响应包含: `total`, `page`, `page_size`, `tasks`
