"""Project request/response schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ProjectCreate(BaseModel):
    """Project creation schema."""

    name: str
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    """Project update schema."""

    name: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    """Project response schema."""

    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    chat_count: int = 0
    task_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectDetailResponse(ProjectResponse):
    """Detailed project response with related data."""

    chats: Optional[List[dict]] = []
    tasks: Optional[List[dict]] = []
