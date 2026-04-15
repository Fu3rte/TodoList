# Git 分支设置与 CLAUDE.md 撰写计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建 frontend/backend 分支，设置 Git 工作流，撰写 CLAUDE.md 规范前后端 agent 的开发流程

**Architecture:**
- `master` 分支: 稳定主分支，所有功能通过 PR review 后合并
- `frontend` 分支: 前端开发分支（React + Vite + TypeScript）
- `backend` 分支: 后端开发分支（Python FastAPI + SQLAlchemy）
- 开发流程: feature branch → PR review → 合并到对应开发分支 → 最终合并 master

**Tech Stack:**
- Frontend: React 19, Vite 8, TypeScript 6, ESLint
- Backend: Python, FastAPI, SQLAlchemy

---

## Task 1: 创建并配置 frontend 分支

**Files:**
- Create: `CLAUDE.md`
- Modify: `.gitignore` (添加 backend/ 排除)

- [ ] **Step 1: 从 master 创建 frontend 分支**

```bash
git checkout master
git branch frontend
git checkout frontend
```

- [ ] **Step 2: 创建 CLAUDE.md 文件**

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

TodoList - 任务管理全栈应用，支持用户认证、分类管理、标签管理、任务管理。

## 开发环境

### 前端
```bash
cd frontend
npm install
npm run dev    # 开发服务器
npm run build  # 生产构建
npm run lint   # ESLint 检查
```

### 后端
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Git 工作流

### 分支策略
- `master`: 稳定主分支，所有功能通过 PR review 后合并
- `frontend`: 前端开发分支
- `backend`: 后端开发分支
- `feature/*`: 功能分支命名规范

### 开发流程
1. 从对应开发分支（frontend/backend）创建 feature 分支
2. 开发完成后提交 PR
3. 通过 code review 后合并
4. 定期从 master 同步更新到各开发分支

### 常用命令
```bash
# 创建功能分支
git checkout -b feature/xxx frontend  # 前端功能
git checkout -b feature/xxx backend   # 后端功能

# 提交代码
git add .
git commit -m "feat: 添加 xxx 功能"
git push -u origin feature/xxx

# 创建 PR (通过 GitHub CLI)
gh pr create --title "feat: xxx" --body "## Summary\n- 新增功能\n\n## Test plan\n- [ ] 测试用例"

# 合并后删除分支
git checkout master
git pull
git branch -d feature/xxx
```

## 架构说明

### 前端 (frontend/)
- `src/App.tsx`: 主应用组件
- `src/main.tsx`: 入口文件
- `src/components/`: UI 组件目录
- `src/api/`: API 调用层
- `src/stores/`: 状态管理

### 后端 (backend/)
- `app/main.py`: FastAPI 应用入口
- `app/api/`: API 路由
- `app/models/`: 数据库模型
- `app/schemas/`: Pydantic schemas
- `app/crud/`: 数据库操作

## API 约定

后端 API 基础路径: `/api/v1`

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新 Token

### 分类
- `GET /api/v1/categories` - 获取分类树
- `POST /api/v1/categories` - 创建分类
- `PUT /api/v1/categories/{id}` - 更新分类
- `DELETE /api/v1/categories/{id}` - 删除分类

### 标签
- `GET /api/v1/tags` - 获取标签列表
- `POST /api/v1/tags` - 创建标签
- `PUT /api/v1/tags/{id}` - 更新标签
- `DELETE /api/v1/tags/{id}` - 删除标签

### 任务
- `GET /api/v1/tasks` - 获取任务列表（支持分页、筛选）
- `POST /api/v1/tasks` - 创建任务
- `PUT /api/v1/tasks/{id}` - 更新任务
- `PATCH /api/v1/tasks/{id}/complete` - 标记完成
- `DELETE /api/v1/tasks/{id}` - 删除任务

## 数据库模型

### User
- id, email, hashed_password, created_at

### Category
- id, user_id, parent_id, name, created_at

### Tag
- id, user_id, name, created_at

### Task
- id, user_id, category_id, title, description, priority, due_date, is_completed, created_at, updated_at

### TaskTag (关联表)
- task_id, tag_id
```

- [ ] **Step 3: 更新 frontend 分支的 .gitignore，添加 backend 排除**

```bash
# 在 frontend/.gitignore 中添加
backend/
```

- [ ] **Step 4: 提交 frontend 分支更改**

```bash
git add CLAUDE.md frontend/.gitignore
git commit -m "chore: 创建 frontend 分支，添加 CLAUDE.md"
git push -u origin frontend
```

---

## Task 2: 创建并配置 backend 分支

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/requirements.txt`

- [ ] **Step 1: 从 master 创建 backend 分支**

```bash
git checkout master
git branch backend
git checkout backend
```

- [ ] **Step 2: 创建 backend 基础结构**

创建目录结构:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── categories.py
│   │   ├── tags.py
│   │   └── tasks.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── tag.py
│   │   └── task.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── category.py
│   │   ├── tag.py
│   │   └── task.py
│   └── crud/
│       ├── __init__.py
│       ├── user.py
│       ├── category.py
│       ├── tag.py
│       └── task.py
├── tests/
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_categories.py
│   ├── test_tags.py
│   └── test_tasks.py
├── requirements.txt
└── .gitignore
```

- [ ] **Step 3: 创建 requirements.txt**

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
pydantic==2.9.2
pydantic-settings==2.5.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
alembic==1.13.3
pytest==8.3.3
pytest-asyncio==0.24.0
httpx==0.27.2
```

- [ ] **Step 4: 创建 backend/.gitignore**

```gitignore
__pycache__/
*.py[cod]
venv/
ENV/
.env
*.db
alembic.ini
```

- [ ] **Step 5: 创建基础 FastAPI 应用**

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TodoList API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "TodoList API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
```

- [ ] **Step 6: 提交 backend 分支**

```bash
git add backend/ backend/.gitignore
git commit -m "chore: 创建 backend 分支，添加 FastAPI 基础结构"
git push -u origin backend
```

---

## Task 3: 更新 master 分支（可选，仅保留文档）

- [ ] **Step 1: 决定 master 分支策略**

选项 A: master 保持为空，仅作为合并目标
选项 B: master 包含完整项目快照

**推荐选项 A**: master 只保留 CLAUDE.md 和基础 .gitignore

- [ ] **Step 2: 如果选择选项 A，从 master 移除源代码**

```bash
git checkout master
git rm -rf frontend/ backend/ plans/
git add CLAUDE.md
git commit -m "chore: master 仅保留文档，分支分离开发"
git push
```

---

## Task 4: 验证分支结构

- [ ] **Step 1: 验证所有分支已创建并推送**

```bash
git branch -a
git log --oneline --graph --all
```

期望输出:
```
* master
  frontend
  backend
  remotes/origin/frontend
  remotes/origin/backend
  remotes/origin/master
```

---

## 验证清单

- [ ] frontend 分支包含完整前端代码和 CLAUDE.md
- [ ] backend 分支包含 FastAPI 基础结构
- [ ] master 分支已更新（根据选择）
- [ ] 所有分支已推送到 GitHub
- [ ] GitHub 仓库地址: https://github.com/Fu3rte/TodoList
