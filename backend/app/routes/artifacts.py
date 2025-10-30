"""Artifact routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
import secrets

from app.db import get_db
from app.models.artifact import Artifact
from app.models.user import User
from app.schemas.artifact import (
    ArtifactCreate,
    ArtifactResponse,
    ArtifactUpdate,
    ArtifactPublishResponse,
    ArtifactPublicResponse,
)
from app.routes.users import get_current_user
from app.core.settings import settings

router = APIRouter(prefix="/artifacts")


@router.get("", response_model=dict)
def list_artifacts(
    published: bool = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's artifacts (scratchpad tabs)."""
    query = db.query(Artifact).filter(Artifact.user_id == current_user.id)

    # Filter by published status if specified
    if published is not None:
        query = query.filter(Artifact.published == published)

    # Count total
    total = query.count()

    # Get paginated results
    artifacts = query.order_by(desc(Artifact.created_at)).offset(offset).limit(limit).all()

    data = [
        {
            "id": artifact.id,
            "title": artifact.title,
            "file_type": artifact.file_type,
            "file_name": artifact.file_name,
            "published": artifact.published,
            "views": artifact.views,
            "share_token": artifact.share_token,
            "share_url": f"{settings.frontend_url}/share/{artifact.id}/{artifact.share_token}"
            if artifact.share_token
            else None,
            "created_at": artifact.created_at,
            "published_at": artifact.published_at,
        }
        for artifact in artifacts
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


@router.post("", response_model=ArtifactResponse, status_code=status.HTTP_201_CREATED)
def create_artifact(
    artifact_data: ArtifactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new artifact."""
    new_artifact = Artifact(
        user_id=current_user.id,
        title=artifact_data.title,
        content=artifact_data.content,
        file_type=artifact_data.file_type,
        file_name=artifact_data.file_name,
        history=[artifact_data.content],
        history_index=0,
    )
    db.add(new_artifact)
    db.commit()
    db.refresh(new_artifact)

    return {
        "id": new_artifact.id,
        "user_id": new_artifact.user_id,
        "title": new_artifact.title,
        "content": new_artifact.content,
        "file_type": new_artifact.file_type,
        "file_name": new_artifact.file_name,
        "file_path": new_artifact.file_path,
        "history": new_artifact.history,
        "history_index": new_artifact.history_index,
        "published": new_artifact.published,
        "share_token": new_artifact.share_token,
        "share_url": None,
        "views": new_artifact.views,
        "published_at": new_artifact.published_at,
        "created_at": new_artifact.created_at,
        "updated_at": new_artifact.updated_at,
    }


@router.get("/{artifact_id}", response_model=ArtifactResponse)
def get_artifact(
    artifact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get artifact details with content."""
    artifact = (
        db.query(Artifact)
        .filter(Artifact.id == artifact_id, Artifact.user_id == current_user.id)
        .first()
    )
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artifact not found",
        )

    return {
        "id": artifact.id,
        "user_id": artifact.user_id,
        "title": artifact.title,
        "content": artifact.content,
        "file_type": artifact.file_type,
        "file_name": artifact.file_name,
        "file_path": artifact.file_path,
        "history": artifact.history,
        "history_index": artifact.history_index,
        "published": artifact.published,
        "share_token": artifact.share_token,
        "share_url": f"{settings.frontend_url}/share/{artifact.id}/{artifact.share_token}"
        if artifact.share_token
        else None,
        "views": artifact.views,
        "published_at": artifact.published_at,
        "created_at": artifact.created_at,
        "updated_at": artifact.updated_at,
    }


@router.put("/{artifact_id}", response_model=ArtifactResponse)
def update_artifact(
    artifact_id: int,
    artifact_data: ArtifactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update artifact content or metadata."""
    artifact = (
        db.query(Artifact)
        .filter(Artifact.id == artifact_id, Artifact.user_id == current_user.id)
        .first()
    )
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artifact not found",
        )

    if artifact_data.title:
        artifact.title = artifact_data.title
    if artifact_data.content is not None:
        # Add to history
        artifact.history.append(artifact.content)
        artifact.history_index = len(artifact.history) - 1
        artifact.content = artifact_data.content
    if artifact_data.file_type:
        artifact.file_type = artifact_data.file_type
    if artifact_data.file_name:
        artifact.file_name = artifact_data.file_name

    db.commit()
    db.refresh(artifact)

    return {
        "id": artifact.id,
        "user_id": artifact.user_id,
        "title": artifact.title,
        "content": artifact.content,
        "file_type": artifact.file_type,
        "file_name": artifact.file_name,
        "file_path": artifact.file_path,
        "history": artifact.history,
        "history_index": artifact.history_index,
        "published": artifact.published,
        "share_token": artifact.share_token,
        "share_url": f"{settings.frontend_url}/share/{artifact.id}/{artifact.share_token}"
        if artifact.share_token
        else None,
        "views": artifact.views,
        "published_at": artifact.published_at,
        "created_at": artifact.created_at,
        "updated_at": artifact.updated_at,
    }


@router.post("/{artifact_id}/publish", response_model=ArtifactPublishResponse)
def publish_artifact(
    artifact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Publish an artifact and generate share link."""
    artifact = (
        db.query(Artifact)
        .filter(Artifact.id == artifact_id, Artifact.user_id == current_user.id)
        .first()
    )
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artifact not found",
        )

    # Generate share token if not already published
    if not artifact.share_token:
        artifact.share_token = secrets.token_urlsafe(32)

    artifact.published = True
    artifact.published_at = datetime.utcnow()
    db.commit()
    db.refresh(artifact)

    return {
        "id": artifact.id,
        "published": artifact.published,
        "share_token": artifact.share_token,
        "share_url": f"{settings.frontend_url}/share/{artifact.id}/{artifact.share_token}",
        "published_at": artifact.published_at,
    }


@router.get("/share/{share_token}", response_model=ArtifactPublicResponse)
def get_public_artifact(
    share_token: str,
    db: Session = Depends(get_db),
):
    """Get public artifact (no auth required)."""
    artifact = (
        db.query(Artifact)
        .filter(Artifact.share_token == share_token, Artifact.published == True)
        .first()
    )
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artifact not found or not published",
        )

    # Increment views
    artifact.views += 1
    db.commit()

    # Get author
    author = db.query(User).filter(User.id == artifact.user_id).first()

    return {
        "id": artifact.id,
        "title": artifact.title,
        "file_type": artifact.file_type,
        "content": artifact.content,
        "author": author.display_name if author else "Anonymous",
        "views": artifact.views,
        "published_at": artifact.published_at,
    }


@router.delete("/{artifact_id}")
def delete_artifact(
    artifact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an artifact."""
    artifact = (
        db.query(Artifact)
        .filter(Artifact.id == artifact_id, Artifact.user_id == current_user.id)
        .first()
    )
    if not artifact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artifact not found",
        )

    db.delete(artifact)
    db.commit()

    return {
        "id": artifact_id,
        "message": "Artifact deleted successfully",
    }
