# Task 2: Data Models

**Goal:** Create Tortoise ORM models for User, Category, Tag, Task with Priority enum.

**Files:**
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/models/user.py`
- Create: `backend/app/models/category.py`
- Create: `backend/app/models/tag.py`
- Create: `backend/app/models/task.py`
- Create: `backend/app/models/enums.py`

---

## Step 1: Create app/models/__init__.py

```python
from app.models.user import User
from app.models.category import Category
from app.models.tag import Tag
from app.models.task import Task, TaskTag
from app.models.enums import Priority

__all__ = ["User", "Category", "Tag", "Task", "TaskTag", "Priority"]
```

## Step 2: Create app/models/enums.py

```python
from enum import Enum


class Priority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
```

## Step 3: Create app/models/user.py

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

## Step 4: Create app/models/category.py

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

## Step 5: Create app/models/tag.py

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

## Step 6: Create app/models/task.py

```python
from tortoise import fields
from tortoise.models import Model
from app.models.enums import Priority


class Task(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    category = fields.ForeignKeyField("models.Category", related_name="tasks", null=True)
    priority = fields.CharEnumField(enum_class=Priority, null=True)
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

## Step 7: Run aerich init

```bash
cd backend && aerich init -t app.database.TORTOISE_ORM
```

## Step 8: Commit

```bash
git add backend/app/models/
git commit -m "feat: add Tortoise ORM models for User, Category, Tag, Task"
```
