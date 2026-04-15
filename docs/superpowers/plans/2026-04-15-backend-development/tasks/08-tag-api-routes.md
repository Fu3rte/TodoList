# Task 8: Tag API Routes

**Goal:** Implement tag CRUD endpoints.

**Files:**
- Create: `backend/app/services/tag_service.py`
- Create: `backend/app/api/routes/tags.py`

---

## Step 1: Create app/services/tag_service.py

```python
from typing import List
from tortoise.exceptions import DoesNotExist
from app.models.tag import Tag
from app.models.user import User
from app.schemas.tag import TagCreate, TagUpdate


class TagService:
    @staticmethod
    async def create(user: User, data: TagCreate) -> Tag:
        tag = await Tag.create(name=data.name, user=user)
        return tag

    @staticmethod
    async def get_by_id(user: User, tag_id: int) -> Tag:
        try:
            return await Tag.get(id=tag_id, user=user)
        except DoesNotExist:
            raise ValueError("Tag not found")

    @staticmethod
    async def get_all(user: User) -> List[Tag]:
        return await Tag.filter(user=user)

    @staticmethod
    async def update(user: User, tag_id: int, data: TagUpdate) -> Tag:
        tag = await TagService.get_by_id(user, tag_id)
        if data.name is not None:
            tag.name = data.name
        await tag.save()
        return tag

    @staticmethod
    async def delete(user: User, tag_id: int) -> None:
        tag = await TagService.get_by_id(user, tag_id)
        await tag.delete()
```

## Step 2: Create app/api/routes/tags.py

```python
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.user import User
from app.schemas.tag import TagCreate, TagUpdate, TagResponse
from app.services.tag_service import TagService
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TagResponse])
async def get_tags(current_user: User = Depends(get_current_user)):
    tags = await TagService.get_all(current_user)
    return tags


@router.post("/", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    data: TagCreate,
    current_user: User = Depends(get_current_user),
):
    tag = await TagService.create(current_user, data)
    return tag


@router.put("/{tag_id}", response_model=TagResponse)
async def update_tag(
    tag_id: int,
    data: TagUpdate,
    current_user: User = Depends(get_current_user),
):
    try:
        tag = await TagService.update(current_user, tag_id, data)
        return tag
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: int,
    current_user: User = Depends(get_current_user),
):
    try:
        await TagService.delete(current_user, tag_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
```

## Step 3: Commit

```bash
git add backend/app/api/routes/tags.py backend/app/services/tag_service.py
git commit -m "feat: add tag CRUD endpoints"
```
