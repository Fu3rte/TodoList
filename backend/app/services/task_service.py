from typing import List, Optional
from tortoise.exceptions import DoesNotExist
from app.models.task import Task, TaskTag
from app.models.tag import Tag
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate
from app.models.enums import Priority


class TaskService:
    @staticmethod
    async def create(user: User, data: TaskCreate) -> Task:
        tag_ids = data.tag_ids or []
        task_data = data.model_dump(exclude={"tag_ids"})
        task = await Task.create(user=user, **task_data)

        if tag_ids:
            for tag_id in tag_ids:
                await TaskTag.create(task=task, tag_id=tag_id)

        return task

    @staticmethod
    async def get_by_id(user: User, task_id: int) -> Task:
        try:
            return await Task.get(id=task_id, user=user)
        except DoesNotExist:
            raise ValueError("Task not found")

    @staticmethod
    async def get_all(
        user: User,
        category_id: Optional[int] = None,
        priority: Optional[Priority] = None,
        is_completed: Optional[bool] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[List[Task], int]:
        filters = {"user": user}
        if category_id is not None:
            filters["category_id"] = category_id
        if priority is not None:
            filters["priority"] = priority
        if is_completed is not None:
            filters["is_completed"] = is_completed

        total = await Task.filter(**filters).count()
        tasks = await Task.filter(**filters).offset((page - 1) * page_size).limit(page_size)
        return tasks, total

    @staticmethod
    async def update(user: User, task_id: int, data: TaskUpdate) -> Task:
        task = await TaskService.get_by_id(user, task_id)

        update_data = data.model_dump(exclude_unset=True, exclude={"tag_ids"})
        for key, value in update_data.items():
            setattr(task, key, value)
        await task.save()

        if data.tag_ids is not None:
            await TaskTag.filter(task=task).delete()
            for tag_id in data.tag_ids:
                await TaskTag.create(task=task, tag_id=tag_id)

        return task

    @staticmethod
    async def toggle(user: User, task_id: int) -> Task:
        task = await TaskService.get_by_id(user, task_id)
        task.is_completed = not task.is_completed
        await task.save()
        return task

    @staticmethod
    async def delete(user: User, task_id: int) -> None:
        task = await TaskService.get_by_id(user, task_id)
        await TaskTag.filter(task=task).delete()
        await task.delete()
