# Task 7: Category API Routes

**Goal:** Implement category CRUD endpoints with hierarchical tree building.

**Files:**
- Create: `backend/app/services/category_service.py`
- Create: `backend/app/api/routes/categories.py`

---

## Step 1: Create app/services/category_service.py

```python
from typing import List, Optional
from tortoise.exceptions import DoesNotExist
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    @staticmethod
    async def create(user: User, data: CategoryCreate) -> Category:
        category = await Category.create(
            name=data.name,
            parent_id=data.parent_id,
            user=user,
        )
        return category

    @staticmethod
    async def get_by_id(user: User, category_id: int) -> Category:
        try:
            return await Category.get(id=category_id, user=user)
        except DoesNotExist:
            raise ValueError("Category not found")

    @staticmethod
    async def get_all(user: User) -> List[Category]:
        return await Category.filter(user=user)

    @staticmethod
    async def update(user: User, category_id: int, data: CategoryUpdate) -> Category:
        category = await CategoryService.get_by_id(user, category_id)
        if data.name is not None:
            category.name = data.name
        if data.parent_id is not None:
            category.parent_id = data.parent_id
        await category.save()
        return category

    @staticmethod
    async def delete(user: User, category_id: int) -> None:
        category = await CategoryService.get_by_id(user, category_id)
        await category.delete()

    @staticmethod
    async def get_tree(user: User) -> List[dict]:
        categories = await Category.filter(user=user)
        return CategoryService._build_tree(categories)

    @staticmethod
    def _build_tree(categories: List[Category]) -> List[dict]:
        category_dict = {c.id: {"id": c.id, "name": c.name, "parent_id": c.parent_id, "children": []} for c in categories}
        roots = []
        for cat in categories:
            cat_data = category_dict[cat.id]
            if cat.parent_id is None:
                roots.append(cat_data)
            else:
                parent = category_dict.get(cat.parent_id)
                if parent:
                    parent["children"].append(cat_data)
        return roots
```

## Step 2: Create app/api/routes/categories.py

```python
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
```

## Step 3: Commit

```bash
git add backend/app/api/routes/categories.py backend/app/services/category_service.py
git commit -m "feat: add category CRUD endpoints"
```
