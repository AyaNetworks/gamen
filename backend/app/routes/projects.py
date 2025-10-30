"""Project routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime

from app.db import get_db
from app.models.project import Project
from app.models.chat import ChatSession
from app.models.task import Task
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectDetailResponse,
    ProjectUpdate,
)
from app.routes.users import get_current_user

router = APIRouter(prefix="/projects")


@router.get("", response_model=dict)
def list_projects(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    include_archived: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all projects for current user."""
    query = db.query(Project).filter(Project.user_id == current_user.id)

    # Filter archived status
    if not include_archived:
        query = query.filter(Project.archived_at == None)

    # Count total
    total = query.count()

    # Get paginated results
    projects = query.order_by(desc(Project.created_at)).offset(offset).limit(limit).all()

    data = [
        {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "chat_count": len(project.chats),
            "task_count": len(project.tasks),
            "created_at": project.created_at,
            "updated_at": project.updated_at,
        }
        for project in projects
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


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new project."""
    new_project = Project(
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "id": new_project.id,
        "user_id": new_project.user_id,
        "name": new_project.name,
        "description": new_project.description,
        "chat_count": 0,
        "task_count": 0,
        "created_at": new_project.created_at,
        "updated_at": new_project.updated_at,
    }


@router.get("/{project_id}", response_model=ProjectDetailResponse)
def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get project details with associated chats and tasks."""
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    chats = db.query(ChatSession).filter(ChatSession.project_id == project_id).all()
    tasks = db.query(Task).filter(Task.project_id == project_id).all()

    return {
        "id": project.id,
        "user_id": project.user_id,
        "name": project.name,
        "description": project.description,
        "chat_count": len(chats),
        "task_count": len(tasks),
        "chats": [
            {
                "id": chat.id,
                "title": chat.title,
                "message_count": len(chat.messages),
                "last_message_at": max(
                    (msg.created_at for msg in chat.messages), default=None
                ),
            }
            for chat in chats
        ],
        "tasks": [
            {
                "id": task.id,
                "title": task.title,
                "priority": task.priority,
                "status": task.status,
                "completed_at": task.completed_at,
            }
            for task in tasks
        ],
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update project details."""
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    if project_data.name:
        project.name = project_data.name
    if project_data.description is not None:
        project.description = project_data.description

    db.commit()
    db.refresh(project)

    return {
        "id": project.id,
        "user_id": project.user_id,
        "name": project.name,
        "description": project.description,
        "chat_count": len(project.chats),
        "task_count": len(project.tasks),
        "created_at": project.created_at,
        "updated_at": project.updated_at,
    }


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Archive a project."""
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    project.archived_at = datetime.utcnow()
    db.commit()

    return {
        "id": project.id,
        "message": "Project archived successfully",
    }
