from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class Attachment(BaseModel):
    name: str
    size: int
    type: str
    preview: Optional[str] = None

class Message(BaseModel):
    role: str
    content: str
    timestamp: str = Field(default_factory=lambda: "")
    type: Optional[str] = "text"
    status: Optional[str] = "success"
    trace: Optional[str] = None
    attachments: Optional[List[Attachment]] = None
    replyingTo: Optional[str] = None

class ChatSession(BaseModel):
    id: int
    title: str
    messages: List[Message] = []
    created_at: str

class Event(BaseModel):
    type: str
    data: Any

class State(BaseModel):
    chat_sessions: List[ChatSession] = []
    current_chat_id: int = 1
