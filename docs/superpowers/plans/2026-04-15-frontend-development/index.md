# TodoList Frontend Business 功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

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

## Tasks

| # | Task | Description |
|---|------|-------------|
| 1 | [Project Setup](./tasks/01-project-setup.md) | 项目基础配置：依赖安装、类型定义、Axios、Zustand Stores、路由配置、入口文件 |
| 2 | [Auth Module](./tasks/02-auth-module.md) | 认证模块：类型、API服务、Hooks、页面组件 |
| 3 | [Categories Module](./tasks/03-categories-module.md) | 分类模块：类型、API服务、Hooks、组件 |
| 4 | [Tags Module](./tasks/04-tags-module.md) | 标签模块：类型、API服务、Hooks、组件 |
| 5 | [Tasks Module](./tasks/05-tasks-module.md) | 任务模块：类型、API服务、Hooks、组件、页面 |
| 6 | [Shared Components](./tasks/06-shared-components.md) | 共享组件：LoadingSpinner、EmptyState、ErrorMessage、useDebounce、useClickOutside |
| 7 | [Integration](./tasks/07-integration.md) | 集成验证：运行开发服务器并验证所有页面正常渲染 |

---

**Plan saved to `docs/superpowers/plans/2026-04-15-frontend-development.md`.**
