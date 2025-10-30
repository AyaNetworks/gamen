"""Artifact request/response schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class ArtifactCreate(BaseModel):
    """Artifact creation schema."""

    title: str
    content: str
    file_type: Optional[str] = None
    file_name: Optional[str] = None


class ArtifactUpdate(BaseModel):
    """Artifact update schema."""

    title: Optional[str] = None
    content: Optional[str] = None
    file_type: Optional[str] = None
    file_name: Optional[str] = None


class ArtifactResponse(BaseModel):
    """Artifact response schema."""

    id: int
    user_id: int
    title: str
    content: str
    file_type: Optional[str] = None
    file_name: Optional[str] = None
    file_path: Optional[str] = None
    history: List[str] = []
    history_index: int = 0
    published: bool = False
    share_token: Optional[str] = None
    share_url: Optional[str] = None
    views: int = 0
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ArtifactPublishResponse(BaseModel):
    """Artifact publish response schema."""

    id: int
    published: bool
    share_token: Optional[str] = None
    share_url: Optional[str] = None
    published_at: Optional[datetime] = None


class ArtifactPublicResponse(BaseModel):
    """Public artifact response schema (no auth required)."""

    id: int
    title: str
    file_type: Optional[str] = None
    content: str
    author: str
    views: int
    published_at: datetime
