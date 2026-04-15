# Task 9: Task API Routes

**Goal:** Implement task CRUD endpoints with filtering, pagination, and toggle completion.

**Files:**
- Create: `backend/app/services/task_service.py`
- Create: `backend/app/api/routes/tasks.py`

---

## Step 1: Create app/services/task_service.py

```python
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
```

## Step 2: Create app/api/routes/tasks.py

```python
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from app.services.task_service import TaskService
from app.api.deps import get_current_user
from app.models.enums import Priority

router = APIRouter()


@router.get("/", response_model=TaskListResponse)
async def get_tasks(
    category_id: Optional[int] = Query(None),
    priority: Optional[Priority] = Query(None),
    is_completed: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
):
    tasks, total = await TaskService.get_all(
        current_user,
        category_id=category_id,
        priority=priority,
        is_completed=is_completed,
        page=page,
        page_size=page_size,
    )
    return TaskListResponse(tasks=tasks, total=total, page=page, page_size=page_size)


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    current_user: User = Depends(get_current_user),
):
    task = await TaskService.create(current_user, data)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
):
    try:
        task = await TaskService.get_by_id(current_user, task_id)
        return task
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    data: TaskUpdate,
    current_user: User = Depends(get_current_user),
):
    try:
        task = await TaskService.update(current_user, task_id, data)
        return task
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.patch("/{task_id}/toggle", response_model=TaskResponse)
async def toggle_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
):
    try:
        task = await TaskService.toggle(current_user, task_id)
        return task
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
):
    try:
        await TaskService.delete(current_user, task_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
```

## Step 3: Commit

```bash
git add backend/app/api/routes/tasks.py backend/app/services/task_service.py
git commit -m "feat: add task CRUD endpoints with filtering and pagination"
```
