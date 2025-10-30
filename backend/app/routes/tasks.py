"""Task routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from datetime import datetime

from app.db import get_db
from app.models.task import Task
from app.models.project import Project
from app.models.user import User
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.routes.users import get_current_user

router = APIRouter(prefix="/tasks")


@router.get("", response_model=dict)
def list_tasks(
    project_id: int = Query(None),
    status: str = Query(None),
    priority: str = Query(None),
    scope: str = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List tasks with filtering and sorting."""
    query = db.query(Task).filter(Task.user_id == current_user.id)

    # Filters
    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    if scope:
        query = query.filter(Task.scope == scope)

    # Filter archived
    query = query.filter(Task.archived_at == None)

    # Count total
    total = query.count()

    # Sorting
    sort_column = getattr(Task, sort_by, Task.created_at)
    order = desc(sort_column) if sort_order == "desc" else asc(sort_column)
    query = query.order_by(order)

    # Pagination
    tasks = query.offset(offset).limit(limit).all()

    data = [
        {
            "id": task.id,
            "user_id": task.user_id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority,
            "status": task.status,
            "project_id": task.project_id,
            "scope": "project" if task.project_id else "global",
            "due_date": task.due_date,
            "completed_at": task.completed_at,
            "tags": task.tags,
            "created_at": task.created_at,
            "updated_at": task.updated_at,
        }
        for task in tasks
    ]

    return {
        "data": data,
        "pagination": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "hasMore": offset + limit < total,
        },
    }


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new task."""
    # Validate project exists if specified
    if task_data.project_id:
        project = (
            db.query(Project)
            .filter(Project.id == task_data.project_id, Project.user_id == current_user.id)
            .first()
        )
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

    new_task = Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority or "medium",
        project_id=task_data.project_id,
        due_date=task_data.due_date,
        tags=task_data.tags or [],
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "id": new_task.id,
        "user_id": new_task.user_id,
        "title": new_task.title,
        "description": new_task.description,
        "priority": new_task.priority,
        "status": new_task.status,
        "project_id": new_task.project_id,
        "scope": "project" if new_task.project_id else "global",
        "due_date": new_task.due_date,
        "completed_at": new_task.completed_at,
        "tags": new_task.tags,
        "created_at": new_task.created_at,
        "updated_at": new_task.updated_at,
    }


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get task details."""
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return {
        "id": task.id,
        "user_id": task.user_id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "status": task.status,
        "project_id": task.project_id,
        "scope": "project" if task.project_id else "global",
        "due_date": task.due_date,
        "completed_at": task.completed_at,
        "tags": task.tags,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update task."""
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    if task_data.title:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority:
        task.priority = task_data.priority
    if task_data.status:
        task.status = task_data.status
        if task_data.status == "completed":
            task.completed_at = datetime.utcnow()
        else:
            task.completed_at = None
    if task_data.due_date is not None:
        task.due_date = task_data.due_date
    if task_data.tags is not None:
        task.tags = task_data.tags

    db.commit()
    db.refresh(task)

    return {
        "id": task.id,
        "user_id": task.user_id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "status": task.status,
        "project_id": task.project_id,
        "scope": "project" if task.project_id else "global",
        "due_date": task.due_date,
        "completed_at": task.completed_at,
        "tags": task.tags,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Archive a task."""
    task = (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == current_user.id)
        .first()
    )
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    task.archived_at = datetime.utcnow()
    db.commit()

    return {
        "id": task.id,
        "message": "Task archived successfully",
    }
