"""Task CRUD endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="/api/{user_id}/tasks", tags=["Tasks"])


def verify_user_access(
    user_id: int,
    current_user: User,
) -> None:
    """
    Verify that the current user has access to the requested user's tasks.

    Args:
        user_id: User ID from the URL path
        current_user: Current authenticated user

    Raises:
        HTTPException: If user doesn't have access
    """
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these tasks",
        )


@router.get("", response_model=list[TaskResponse])
def get_all_tasks(
    user_id: Annotated[int, Path()],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[Task]:
    """
    Get all tasks for the authenticated user.

    Args:
        user_id: User ID from path
        current_user: Current authenticated user
        db: Database session

    Returns:
        list[TaskResponse]: List of all tasks
    """
    verify_user_access(user_id, current_user)
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return tasks


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: Annotated[int, Path()],
    task_data: TaskCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> Task:
    """
    Create a new task for the authenticated user.

    Args:
        user_id: User ID from path
        task_data: Task creation data
        current_user: Current authenticated user
        db: Database session

    Returns:
        TaskResponse: Created task
    """
    verify_user_access(user_id, current_user)

    db_task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        category=task_data.category,
        due_date=task_data.due_date,
        user_id=user_id,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: Annotated[int, Path()],
    task_id: Annotated[int, Path()],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> Task:
    """
    Get a specific task by ID.

    Args:
        user_id: User ID from path
        task_id: Task ID to retrieve
        current_user: Current authenticated user
        db: Database session

    Returns:
        TaskResponse: Task details

    Raises:
        HTTPException: If task not found
    """
    verify_user_access(user_id, current_user)

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: Annotated[int, Path()],
    task_id: Annotated[int, Path()],
    task_data: TaskUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> Task:
    """
    Update an existing task.

    Args:
        user_id: User ID from path
        task_id: Task ID to update
        task_data: Task update data
        current_user: Current authenticated user
        db: Database session

    Returns:
        TaskResponse: Updated task

    Raises:
        HTTPException: If task not found
    """
    verify_user_access(user_id, current_user)

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Update only provided fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.category is not None:
        task.category = task_data.category
    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    db.commit()
    db.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: Annotated[int, Path()],
    task_id: Annotated[int, Path()],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    """
    Delete a task.

    Args:
        user_id: User ID from path
        task_id: Task ID to delete
        current_user: Current authenticated user
        db: Database session

    Raises:
        HTTPException: If task not found
    """
    verify_user_access(user_id, current_user)

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    db.delete(task)
    db.commit()
