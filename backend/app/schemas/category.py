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
