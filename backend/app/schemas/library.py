"""Library request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class LibraryResponse(BaseModel):
    """Library response schema."""

    id: int
    user_id: int
    name: str
    file_type: str
    size: int
    file_path: str
    tags: Optional[dict] = None
    download_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
