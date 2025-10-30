"""Task request/response schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class TaskCreate(BaseModel):
    """Task creation schema."""

    title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    project_id: Optional[int] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = []


class TaskUpdate(BaseModel):
    """Task update schema."""

    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None


class TaskResponse(BaseModel):
    """Task response schema."""

    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    project_id: Optional[int] = None
    scope: str  # 'project' or 'global'
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    tags: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
