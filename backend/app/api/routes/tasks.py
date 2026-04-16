from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
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