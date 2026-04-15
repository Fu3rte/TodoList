# Task 3: Pydantic Schemas

**Goal:** Create Pydantic v2 schemas for all entities with proper validation.

**Files:**
- Create: `backend/app/schemas/__init__.py`
- Create: `backend/app/schemas/user.py`
- Create: `backend/app/schemas/token.py`
- Create: `backend/app/schemas/category.py`
- Create: `backend/app/schemas/tag.py`
- Create: `backend/app/schemas/task.py`

---

## Step 1: Create app/schemas/__init__.py

```python
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.token import TokenResponse, RefreshTokenRequest
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse

__all__ = [
    "UserCreate", "UserResponse", "UserLogin",
    "TokenResponse", "RefreshTokenRequest",
    "CategoryCreate", "CategoryUpdate", "CategoryResponse",
    "TagCreate", "TagUpdate", "TagResponse",
    "TaskCreate", "TaskUpdate", "TaskResponse", "TaskListResponse",
]
```

## Step 2: Create app/schemas/user.py

```python
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def username_min_length(cls, v: str) -> str:
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    created_at: datetime
```

## Step 3: Create app/schemas/token.py

```python
from pydantic import BaseModel


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str
```

## Step 4: Create app/schemas/category.py

```python
from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, List


class CategoryCreate(BaseModel):
    name: str
    parent_id: Optional[int] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Category name cannot be empty")
        return v.strip()


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[int] = None


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    parent_id: Optional[int]
    user_id: int
    created_at: datetime
    updated_at: datetime
```

## Step 5: Create app/schemas/tag.py

```python
from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional


class TagCreate(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Tag name cannot be empty")
        return v.strip()


class TagUpdate(BaseModel):
    name: Optional[str] = None


class TagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    user_id: int
    created_at: datetime
```

## Step 6: Create app/schemas/task.py

```python
from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional, List
from app.models.enums import Priority


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    tag_ids: Optional[List[int]] = []

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Task title cannot be empty")
        return v.strip()


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    is_completed: Optional[bool] = None
    tag_ids: Optional[List[int]] = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str]
    category_id: Optional[int]
    priority: Optional[Priority]
    due_date: Optional[datetime]
    is_completed: bool
    user_id: int
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int
    page: int
    page_size: int
```

## Step 7: Commit

```bash
git add backend/app/schemas/
git commit -m "feat: add Pydantic schemas for all entities"
```
