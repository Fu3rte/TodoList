# TodoList 前后端联调开发规范

**日期**: 2026-04-15
**项目名称**: TodoList
**版本**: v1.0

---

## 一、环境配置

### 1.1 环境变量

**前端** `frontend/.env`：
```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=TodoList
```

**后端** `backend/.env`：
```env
DATABASE_URL=mysql://root:password@localhost:3306/todolist
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
```

### 1.2 Vite 代理配置

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

## 二、技术架构

### 2.1 前端

| 项目     | 技术选型                    |
| -------- | --------------------------- |
| 框架     | React 19 + TypeScript       |
| 构建工具 | Vite 8                      |
| 路由     | React Router DOM            |
| 状态管理 | Zustand                     |
| 数据请求 | Tanstack Query + Axios      |
| UI 样式  | Tailwind CSS + shadcn       |
| 动画     | GSAP（交互动画 + 滚动动画） |

### 2.2 后端

| 项目     | 技术选型                    |
| -------- | --------------------------- |
| 框架     | FastAPI (Python 3.11+)      |
| ORM      | Tortoise ORM                |
| 数据库   | MySQL 8.0                   |
| 迁移工具 | aerich                      |
| 认证     | JWT (python-jose)           |
| 密码加密 | bcrypt                      |
| 异步支持 | asyncio + aiomysql          |

### 2.3 数据库

| 表名         | 说明                      |
| ------------ | ------------------------- |
| `users`      | 用户表                    |
| `categories` | 分类表（支持父子层级）    |
| `tags`       | 标签表                    |
| `tasks`      | 任务表                    |
| `task_tags`  | 任务-标签关联表（多对多） |

---

## 三、API 接口规范

### 3.1 基础规范

| 项目 | 规范 |
|------|------|
| Base URL | `/api` |
| 认证方式 | `Authorization: Bearer <access_token>` |
| Content-Type | `application/json` |
| 日期格式 | ISO 8601 (`2026-04-15T10:30:00Z`) |

### 3.2 接口列表

#### 认证接口

| 方法 | 路径 | 请求参数 | 响应 | 说明 |
|------|------|----------|------|------|
| POST | `/api/auth/register` | `{username, email, password}` | `{id, username, email}` | 注册 |
| POST | `/api/auth/login` | FormData `{username, password}` | `{access_token, refresh_token, token_type}` | 登录 |
| POST | `/api/auth/refresh` | `{refresh_token}` | `{access_token, refresh_token}` | 刷新 Token |
| GET | `/api/auth/me` | - | `{id, username, email, created_at}` | 获取当前用户 |

#### 分类接口

| 方法 | 路径 | 请求参数 | 响应 | 说明 |
|------|------|----------|------|------|
| GET | `/api/categories` | - | `Category[]` | 获取分类树 |
| POST | `/api/categories` | `{name, parent_id?}` | `Category` | 创建分类 |
| PUT | `/api/categories/{id}` | `{name, parent_id?}` | `Category` | 更新分类 |
| DELETE | `/api/categories/{id}` | - | `204` | 删除分类 |

#### 标签接口

| 方法 | 路径 | 请求参数 | 响应 | 说明 |
|------|------|----------|------|------|
| GET | `/api/tags` | - | `Tag[]` | 获取所有标签 |
| POST | `/api/tags` | `{name}` | `Tag` | 创建标签 |
| PUT | `/api/tags/{id}` | `{name}` | `Tag` | 更新标签 |
| DELETE | `/api/tags/{id}` | - | `204` | 删除标签 |

#### 任务接口

| 方法 | 路径 | 请求参数 | 响应 | 说明 |
|------|------|----------|------|------|
| GET | `/api/tasks` | `?category_id=&tag_id=&is_completed=&page=&page_size=` | `{total, page, page_size, tasks}` | 获取任务列表 |
| POST | `/api/tasks` | `{title, description?, category_id?, priority?, due_date?, tag_ids?}` | `Task` | 创建任务 |
| GET | `/api/tasks/{id}` | - | `Task` | 获取任务详情 |
| PUT | `/api/tasks/{id}` | `{title?, description?, category_id?, priority?, due_date?, tag_ids?}` | `Task` | 更新任务 |
| PATCH | `/api/tasks/{id}/toggle` | - | `{is_completed}` | 切换完成状态 |
| DELETE | `/api/tasks/{id}` | - | `204` | 删除任务 |

---

## 四、数据模型规范

### 4.1 User

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| username | string(100) | 用户名，唯一 |
| email | string(255) | 邮箱，唯一 |
| created_at | datetime | 创建时间 |

### 4.2 Category

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| name | string(100) | 分类名称 |
| parent_id | int? | 父分类 ID，顶级为 null |
| user_id | int | 所属用户 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### 4.3 Tag

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| name | string(50) | 标签名称 |
| user_id | int | 所属用户 |
| created_at | datetime | 创建时间 |

### 4.4 Task

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| title | string(255) | 任务标题 |
| description | text? | 任务描述 |
| category_id | int? | 所属分类 |
| priority | enum | `high` / `medium` / `low` |
| due_date | datetime? | 截止日期 |
| is_completed | boolean | 是否完成，默认 false |
| user_id | int | 所属用户 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| tags | Tag[] | 关联标签 |
| category | Category? | 所属分类 |

---

## 五、请求/响应规范

### 5.1 请求格式

**Headers**：
```
Content-Type: application/json
Authorization: Bearer eyJhbGc...
```

**登录请求使用 FormData**（OAuth2PasswordRequestForm）：
```
username: user@example.com
password: password123
```

### 5.2 响应格式

**成功响应**：
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**分页响应**：
```json
{
  "total": 100,
  "page": 1,
  "page_size": 20,
  "tasks": [...]
}
```

**错误响应**：
```json
{
  "detail": "Error message here"
}
```

---

## 六、错误处理规范

### 6.1 HTTP 状态码

| 状态码 | 含义 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | 返回数据 |
| 201 | 创建成功 | 返回创建的资源 |
| 204 | 删除成功 | 无返回 |
| 400 | 请求参数错误 | 显示 detail |
| 401 | 未授权 | 刷新 Token，失败则跳转登录 |
| 403 | 禁止访问 | 显示无权限 |
| 404 | 资源不存在 | 显示不存在 |
| 422 | 数据验证错误 | 显示验证详情 |
| 500 | 服务器错误 | 显示服务器错误 |

### 6.2 业务错误

统一使用 `detail` 字段返回错误信息：
```json
{ "detail": "Email already registered" }
```

---

## 七、认证规范

### 7.1 JWT Token

**Access Token**：
- 有效期：30 分钟
- Payload: `{sub: user_id, type: "access", exp: timestamp}`

**Refresh Token**：
- 有效期：7 天
- Payload: `{sub: user_id, type: "refresh", exp: timestamp}`

### 7.2 Token 刷新流程

1. 请求携带 `Authorization: Bearer <access_token>`
2. 若返回 401，调用 `/api/auth/refresh` 获取新 Token
3. 用新 Token 重试原请求
4. 刷新失败则跳转登录页

---

## 八、项目结构

```
TodoList/
├── frontend/                  # 前端项目（已有）
│   ├── src/
│   │   ├── features/          # Feature-based 架构
│   │   │   ├── auth/          # 认证功能
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types/
│   │   │   ├── tasks/         # 任务管理功能
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── types/
│   │   │   ├── categories/    # 分类管理功能
│   │   │   └── tags/          # 标签管理功能
│   │   ├── shared/            # 共享资源
│   │   │   ├── components/    # 通用组件
│   │   │   ├── hooks/         # 通用 Hooks
│   │   │   ├── lib/           # 工具函数
│   │   │   └── types/         # 共享类型
│   │   ├── routes/            # 路由配置
│   │   ├── stores/            # Zustand stores
│   │   └── App.tsx
│   └── ...
│
├── backend/                   # 后端项目（待创建）
│   ├── app/
│   │   ├── api/               # API 路由
│   │   ├── core/              # 核心配置（JWT、安全等）
│   │   ├── models/            # Tortoise ORM 模型
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # 业务逻辑
│   │   └── main.py            # FastAPI 入口
│   ├── migrations/            # aerich 迁移文件
│   ├── aerich.ini             # aerich 配置
│   ├── requirements.txt        # Python 依赖
│   └── ...
│
└── docs/                      # 文档
```

---

## 九、联调验证清单

- [ ] 后端启动：`uvicorn app.main:app --reload --port 8000`
- [ ] 前端启动：`npm run dev` (端口 5173)
- [ ] 注册 → 登录 → 获取 Token 流程
- [ ] Access Token 过期自动刷新
- [ ] 分类/标签/任务 CRUD 操作
- [ ] 任务筛选与分页
- [ ] 路由守卫正确跳转
