"""Chat and message request/response schemas."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class AttachmentResponse(BaseModel):
    """Attachment response schema."""

    id: int
    message_id: int
    type: str
    reference_id: int
    metadata: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    """Message creation schema."""

    content: str
    type: str = "dione"
    attachments: Optional[List[dict]] = None
    replying_to: Optional[int] = None


class MessageResponse(BaseModel):
    """Message response schema."""

    id: int
    chat_id: int
    role: str
    content: str
    type: str
    status: str
    attachments: List[AttachmentResponse] = []
    metadata: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatSessionCreate(BaseModel):
    """Chat session creation schema."""

    title: Optional[str] = "New Chat"
    project_id: Optional[int] = None


class ChatSessionResponse(BaseModel):
    """Chat session response schema."""

    id: int
    user_id: int
    title: str
    project_id: Optional[int] = None
    message_count: int = 0
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatSessionDetailResponse(ChatSessionResponse):
    """Detailed chat session response with messages."""

    messages: List[MessageResponse] = []
