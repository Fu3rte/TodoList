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
