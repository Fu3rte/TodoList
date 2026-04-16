from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import CategoryService
from app.api.deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CategoryResponse])
async def get_categories(current_user: User = Depends(get_current_user)):
    categories = await CategoryService.get_all(current_user)
    return categories


@router.get("/tree")
async def get_category_tree(current_user: User = Depends(get_current_user)):
    tree = await CategoryService.get_tree(current_user)
    return tree


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    current_user: User = Depends(get_current_user),
):
    category = await CategoryService.create(current_user, data)
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
):
    try:
        category = await CategoryService.update(current_user, category_id, data)
        return category
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
):
    try:
        await CategoryService.delete(current_user, category_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))