# TodoList Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

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
│   │   ├── task.py                # Task model + TaskTag m2m
│   │   └── enums.py               # Priority enum
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

## Task Index

| # | Task | File |
|---|------|------|
| 1 | [Project Setup & Configuration](tasks/01-project-setup.md) | `tasks/01-project-setup.md` |
| 2 | [Data Models](tasks/02-data-models.md) | `tasks/02-data-models.md` |
| 3 | [Pydantic Schemas](tasks/03-pydantic-schemas.md) | `tasks/03-pydantic-schemas.md` |
| 4 | [Security & Core Utilities](tasks/04-security-core-utilities.md) | `tasks/04-security-core-utilities.md` |
| 5 | [API Dependencies](tasks/05-api-dependencies.md) | `tasks/05-api-dependencies.md` |
| 6 | [Auth API Routes](tasks/06-auth-api-routes.md) | `tasks/06-auth-api-routes.md` |
| 7 | [Category API Routes](tasks/07-category-api-routes.md) | `tasks/07-category-api-routes.md` |
| 8 | [Tag API Routes](tasks/08-tag-api-routes.md) | `tasks/08-tag-api-routes.md` |
| 9 | [Task API Routes](tasks/09-task-api-routes.md) | `tasks/09-task-api-routes.md` |
| 10 | [Main Application Entry](tasks/10-main-application-entry.md) | `tasks/10-main-application-entry.md` |
| 11 | [Integration Verification](tasks/11-integration-verification.md) | `tasks/11-integration-verification.md` |

---

## Task Order & Dependencies

```
Task 1 (Project Setup)
       ↓
Task 2 (Data Models)
       ↓
Task 3 (Pydantic Schemas)
       ↓
Task 4 (Security & Core)
       ↓
Task 5 (API Dependencies)
       ↓
   ├── Task 6 (Auth Routes) ← depends on Task 4, 5
   ├── Task 7 (Category Routes) ← depends on Task 4, 5
   ├── Task 8 (Tag Routes) ← depends on Task 4, 5
   └── Task 9 (Task Routes) ← depends on Task 4, 5
       ↓
Task 10 (Main Application) ← depends on all routes
       ↓
Task 11 (Integration Verification)
```

**Plan complete.** All 11 tasks have been split into individual files in `docs/superpowers/plans/2026-04-15-backend-development/tasks/`.

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
