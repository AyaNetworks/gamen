"""Chat routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime

from app.db import get_db
from app.models.chat import ChatSession, Message
from app.models.user import User
from app.models.project import Project
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionResponse,
    ChatSessionDetailResponse,
    MessageCreate,
    MessageResponse,
)
from app.routes.users import get_current_user

router = APIRouter(prefix="/chats")


@router.get("", response_model=dict)
def list_chats(
    project_id: int = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    include_archived: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all chat sessions for current user."""
    query = db.query(ChatSession).filter(ChatSession.user_id == current_user.id)

    # Filter by project if specified
    if project_id:
        query = query.filter(ChatSession.project_id == project_id)

    # Filter archived status
    if not include_archived:
        query = query.filter(ChatSession.archived_at == None)

    # Count total
    total = query.count()

    # Get paginated results
    chats = query.order_by(desc(ChatSession.updated_at)).offset(offset).limit(limit).all()

    # Format response
    data = []
    for chat in chats:
        last_message = (
            db.query(Message)
            .filter(Message.chat_id == chat.id)
            .order_by(desc(Message.created_at))
            .first()
        )

        data.append({
            "id": chat.id,
            "title": chat.title,
            "projectId": chat.project_id,
            "messageCount": len(chat.messages),
            "lastMessage": last_message.content if last_message else None,
            "lastMessageAt": last_message.created_at if last_message else None,
            "createdAt": chat.created_at,
            "updatedAt": chat.updated_at,
        })

    return {
        "data": data,
        "pagination": {
            "total": total,
            "limit": limit,
            "offset": offset,
            "hasMore": offset + limit < total,
        },
    }


@router.post("", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
def create_chat(
    chat_data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new chat session."""
    # Validate project exists if specified
    if chat_data.project_id:
        project = (
            db.query(Project)
            .filter(Project.id == chat_data.project_id, Project.user_id == current_user.id)
            .first()
        )
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

    new_chat = ChatSession(
        user_id=current_user.id,
        title=chat_data.title or "New Chat",
        project_id=chat_data.project_id,
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return {
        "id": new_chat.id,
        "user_id": new_chat.user_id,
        "title": new_chat.title,
        "project_id": new_chat.project_id,
        "message_count": 0,
        "last_message": None,
        "last_message_at": None,
        "created_at": new_chat.created_at,
        "updated_at": new_chat.updated_at,
    }


@router.get("/{chat_id}", response_model=ChatSessionDetailResponse)
def get_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a specific chat session with all messages."""
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at).all()

    return {
        "id": chat.id,
        "user_id": chat.user_id,
        "title": chat.title,
        "project_id": chat.project_id,
        "message_count": len(messages),
        "last_message": messages[-1].content if messages else None,
        "last_message_at": messages[-1].created_at if messages else None,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
        "messages": [
            {
                "id": msg.id,
                "chat_id": msg.chat_id,
                "role": msg.role,
                "content": msg.content,
                "type": msg.type,
                "status": msg.status,
                "attachments": [],
                "metadata": msg.meta_data,
                "created_at": msg.created_at,
                "updated_at": msg.updated_at,
            }
            for msg in messages
        ],
    }


@router.put("/{chat_id}", response_model=ChatSessionResponse)
def update_chat(
    chat_id: int,
    chat_data: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update chat title or project association."""
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    if chat_data.title:
        chat.title = chat_data.title
    if chat_data.project_id is not None:
        chat.project_id = chat_data.project_id

    db.commit()
    db.refresh(chat)

    last_message = (
        db.query(Message)
        .filter(Message.chat_id == chat.id)
        .order_by(desc(Message.created_at))
        .first()
    )

    return {
        "id": chat.id,
        "user_id": chat.user_id,
        "title": chat.title,
        "project_id": chat.project_id,
        "message_count": len(chat.messages),
        "last_message": last_message.content if last_message else None,
        "last_message_at": last_message.created_at if last_message else None,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
    }


@router.delete("/{chat_id}")
def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Archive a chat session."""
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    chat.archived_at = datetime.utcnow()
    db.commit()

    return {
        "id": chat.id,
        "message": "Chat archived successfully",
        "archived_at": chat.archived_at,
    }


@router.post("/{chat_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    chat_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message to a chat."""
    # Verify chat exists and user owns it
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    # Create user message
    user_message = Message(
        chat_id=chat_id,
        role="user",
        content=message_data.content,
        type=message_data.type,
        status="success",
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # Mock AI response (in production, call actual AI API)
    ai_response = Message(
        chat_id=chat_id,
        role="ai",
        content=f"[Mock AI Response] Acknowledged: {message_data.content[:50]}...",
        type=message_data.type,
        status="success",
    )
    db.add(ai_response)
    db.commit()
    db.refresh(ai_response)

    # Update chat timestamp
    chat.updated_at = datetime.utcnow()
    db.commit()

    return {
        "id": user_message.id,
        "chat_id": user_message.chat_id,
        "role": user_message.role,
        "content": user_message.content,
        "type": user_message.type,
        "status": user_message.status,
        "attachments": [],
        "metadata": user_message.meta_data,
        "created_at": user_message.created_at,
        "updated_at": user_message.updated_at,
    }


@router.get("/{chat_id}/messages", response_model=dict)
def list_messages(
    chat_id: int,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List messages in a chat with pagination."""
    # Verify chat exists and user owns it
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    # Get total message count
    total = db.query(Message).filter(Message.chat_id == chat_id).count()

    # Get paginated messages
    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at)
        .offset(offset)
        .limit(limit)
        .all()
    )

    data = [
        {
            "id": msg.id,
            "chat_id": msg.chat_id,
            "role": msg.role,
            "content": msg.content,
            "type": msg.type,
            "status": msg.status,
            "attachments": [],
            "metadata": msg.meta_data,
            "created_at": msg.created_at,
            "updated_at": msg.updated_at,
        }
        for msg in messages
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


@router.delete("/messages/{message_id}")
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a message from history."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found",
        )

    # Verify user owns the chat
    chat = (
        db.query(ChatSession)
        .filter(ChatSession.id == message.chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not chat:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this message",
        )

    db.delete(message)
    db.commit()

    return {
        "id": message_id,
        "message": "Message deleted successfully",
    }
