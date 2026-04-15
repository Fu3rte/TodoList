# TodoList Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete FastAPI backend with JWT authentication, hierarchical categories, tags, and tasks using Tortoise ORM + MySQL.

**Architecture:** Clean architecture with separation: API routes → Schemas → Services → Models. JWT tokens for auth with access/refresh token flow. Tortoise ORM for async MySQL access.

**Tech Stack:** FastAPI, Tortoise ORM, aerich, MySQL 8.0, python-jose, bcrypt, aiomysql

---

## File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry, CORS, router aggregation
│   ├── config.py                  # Settings from env
│   ├── database.py                # Tortoise init/close
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # get_current_user, get_db
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py            # /api/auth/*
│   │       ├── categories.py      # /api/categories/*
│   │       ├── tags.py            # /api/tags/*
│   │       └── tasks.py           # /api/tasks/*
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py            # create_access_token, create_refresh_token, verify_token
│   │   └── exceptions.py          # custom HTTPException handlers
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                # User model
│   │   ├── category.py            # Category model (hierarchical)
│   │   ├── tag.py                 # Tag model
│   │   └── task.py                # Task model + TaskTag m2m
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py                # UserCreate, UserResponse, UserLogin
│   │   ├── token.py               # TokenResponse, RefreshTokenRequest
│   │   ├── category.py            # CategoryCreate, CategoryUpdate, CategoryResponse
│   │   ├── tag.py                 # TagCreate, TagUpdate, TagResponse
│   │   └── task.py                # TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
│   └── services/
│       ├── __init__.py
│       ├── auth_service.py        # register, authenticate
│       ├── category_service.py     # category CRUD with tree building
│       ├── tag_service.py          # tag CRUD
│       └── task_service.py         # task CRUD, toggle, filtering, pagination
├── migrations/                     # aerich migration files
├── aerich.ini
├── requirements.txt
└── .env
```

---

## Task 1: Project Setup & Configuration

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env`
- Create: `backend/aerich.ini`
- Create: `backend/app/__init__.py`
- Create: `backend/app/config.py`
- Create: `backend/app/database.py`

- [ ] **Step 1: Create requirements.txt**

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.0
tortoise-orm==0.21.0
aerich==0.7.2
aiomysql==0.2.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
pydantic==2.8.0
pydantic-settings==2.4.0
python-dotenv==1.0.1
```

- [ ] **Step 2: Create .env**

```env
DATABASE_URL=mysql://root:password@localhost:3306/todolist
SECRET_KEY=change-me-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
```

- [ ] **Step 3: Create aerich.ini**

```ini
[aerich]
locations = ./migrations
models = app.models
```

- [ ] **Step 4: Create app/config.py**

```python
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
```

- [ ] **Step 5: Create app/database.py**

```python
from tortoise import Tortoise
from app.config import get_settings


async def init_db():
    settings = get_settings()
    await Tortoise.init(
        db_url=settings.database_url,
        modules={"models": ["app.models"]},
        use_tz=False,
        timezone="UTC",
    )
    await Tortoise.generate_schemas()


async def close_db():
    await Tortoise.close_connections()
```

- [ ] **Step 6: Create app/__init__.py**

```python
# app package
```

- [ ] **Step 7: Commit**

```bash
git add backend/requirements.txt backend/.env backend/aerich.ini backend/app/
git commit -m "feat: add backend project skeleton and configuration"
```

---

## Task 2: Data Models

**Files:**
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/models/user.py`
- Create: `backend/app/models/category.py`
- Create: `backend/app/models/tag.py`
- Create: `backend/app/models/task.py`

- [ ] **Step 1: Create app/models/__init__.py**

```python
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag
from app.models.task import Task, TaskTag

__all__ = ["User", "Category", "Tag", "Task", "TaskTag"]
```

- [ ] **Step 2: Create app/models/user.py**

```python
from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=100, unique=True)
    email = fields.CharField(max_length=255, unique=True)
    hashed_password = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)

    tasks: fields.ReverseRelation["Task"]
    categories: fields.ReverseRelation["Category"]
    tags: fields.ReverseRelation["Tag"]
```

- [ ] **Step 3: Create app/models/category.py**

```python
from tortoise import fields
from tortoise.models import Model


class Category(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    parent_id = fields.IntField(null=True)
    user = fields.ForeignKeyField("models.User", related_name="categories")
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    children: fields.ReverseRelation["Category"]
```

- [ ] **Step 4: Create app/models/tag.py**

```python
from tortoise import fields
from tortoise.models import Model


class Tag(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)
    user = fields.ForeignKeyField("models.User", related_name="tags")
    created_at = fields.DatetimeField(auto_now_add=True)

    tasks: fields.ManyToManyRelation["Task"]
```

- [ ] **Step 5: Create app/models/task.py**

```python
from tortoise import fields
from tortoise.models import Model


class Task(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    category = fields.ForeignKeyField("models.Category", related_name="tasks", null=True)
    priority = fields.CharEnumField(enum_class=..., null=True)  # define enum separately
    due_date = fields.DatetimeField(null=True)
    is_completed = fields.BooleanField(default=False)
    user = fields.ForeignKeyField("models.User", related_name="tasks")
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    tags: fields.ManyToManyRelation["Tag"]


class TaskTag(Model):
    id = fields.IntField(pk=True)
    task = fields.ForeignKeyField("models.Task", related_name="task_tags")
    tag = fields.ForeignKeyField("models.Tag", related_name="tag_tasks")
```

- [ ] **Step 6: Create priority enum and update task.py**

```python
from enum import Enum


class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
```

- [ ] **Step 7: Run aerich init**

```bash
cd backend && aerich init -t app.database.TORTOISE_ORM
```

- [ ] **Step 8: Commit**

```bash
git add backend/app/models/
git commit -m "feat: add Tortoise ORM models for User, Category, Tag, Task"
```

---

## Task 3: Pydantic Schemas

**Files:**
- Create: `backend/app/schemas/__init__.py`
- Create: `backend/app/schemas/user.py`
- Create: `backend/app/schemas/token.py`
- Create: `backend/app/schemas/category.py`
- Create: `backend/app/schemas/tag.py`
- Create: `backend/app/schemas/task.py`

- [ ] **Step 1: Create all schema files with proper validation**

All schemas follow Pydantic v2 pattern with BaseModel, field validators, and ConfigDict for alias.

- [ ] **Step 2: Commit**

```bash
git add backend/app/schemas/
git commit -m "feat: add Pydantic schemas for all entities"
```

---

## Task 4: Security & Core Utilities

**Files:**
- Create: `backend/app/core/__init__.py`
- Create: `backend/app/core/security.py`
- Create: `backend/app/core/exceptions.py`

- [ ] **Step 1: Create app/core/security.py** (JWT token creation/verification, password hashing)

- [ ] **Step 2: Create app/core/exceptions.py** (custom HTTPException handlers)

- [ ] **Step 3: Commit**

```bash
git add backend/app/core/
git commit -m "feat: add JWT security utilities and exception handlers"
```

---

## Task 5: API Dependencies

**Files:**
- Create: `backend/app/api/__init__.py`
- Create: `backend/app/api/deps.py`

- [ ] **Step 1: Create app/api/deps.py** (get_current_user dependency, get_db)

```python
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # decode token, get user from DB, return user
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/api/deps.py
git commit -m "feat: add API dependencies for auth"
```

---

## Task 6: Auth API Routes

**Files:**
- Create: `backend/app/api/routes/__init__.py`
- Create: `backend/app/api/routes/auth.py`

- [ ] **Step 1: Implement endpoints: POST /api/auth/register, POST /api/auth/login, POST /api/auth/refresh, GET /api/auth/me**

- [ ] **Step 2: Commit**

```bash
git add backend/app/api/routes/auth.py
git commit -m "feat: add auth endpoints (register, login, refresh, me)"
```

---

## Task 7: Category API Routes

**Files:**
- Create: `backend/app/api/routes/categories.py`

- [ ] **Step 1: Implement endpoints: GET /api/categories, POST /api/categories, PUT /api/categories/{id}, DELETE /api/categories/{id}**

- [ ] **Step 2: Commit**

```bash
git add backend/app/api/routes/categories.py
git commit -m "feat: add category CRUD endpoints"
```

---

## Task 8: Tag API Routes

**Files:**
- Create: `backend/app/api/routes/tags.py`

- [ ] **Step 1: Implement endpoints: GET /api/tags, POST /api/tags, PUT /api/tags/{id}, DELETE /api/tags/{id}**

- [ ] **Step 2: Commit**

```bash
git add backend/app/api/routes/tags.py
git commit -m "feat: add tag CRUD endpoints"
```

---

## Task 9: Task API Routes

**Files:**
- Create: `backend/app/api/routes/tasks.py`

- [ ] **Step 1: Implement endpoints: GET /api/tasks (with filtering/pagination), POST /api/tasks, GET /api/tasks/{id}, PUT /api/tasks/{id}, PATCH /api/tasks/{id}/toggle, DELETE /api/tasks/{id}**

- [ ] **Step 2: Commit**

```bash
git add backend/app/api/routes/tasks.py
git commit -m "feat: add task CRUD endpoints with filtering and pagination"
```

---

## Task 10: Main Application Entry

**Files:**
- Create: `backend/app/main.py`

- [ ] **Step 1: Create FastAPI app with CORS, router aggregation, lifespan events for db init/close**

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()

app = FastAPI(lifespan=lifespan)
# register routers with /api prefix
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/main.py
git commit -m "feat: add FastAPI main application entry point"
```

---

## Task 11: Integration Verification

- [ ] **Step 1: Verify backend starts successfully**

```bash
cd backend && uvicorn app.main:app --reload --port 8000
```

- [ ] **Step 2: Test all endpoints with curl/httpie**

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-15-backend-development.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?