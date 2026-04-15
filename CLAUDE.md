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
