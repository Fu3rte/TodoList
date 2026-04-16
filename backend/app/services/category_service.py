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