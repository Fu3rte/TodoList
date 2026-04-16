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
