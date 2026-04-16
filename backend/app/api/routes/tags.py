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
