from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import datetime
from typing import Optional, List
from app.models.enums import Priority


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    category_id: Optional[int] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    tag_ids: Optional[List[int]] = []


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
