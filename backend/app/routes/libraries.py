"""Library routes."""

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
import os

from app.db import get_db
from app.models.library import Library
from app.models.user import User
from app.schemas.library import LibraryResponse
from app.routes.users import get_current_user

router = APIRouter(prefix="/libraries")

# For development, files are stored in a local directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=dict)
def list_libraries(
    file_type: str = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List uploaded library files."""
    query = db.query(Library).filter(Library.user_id == current_user.id)

    # Filter by file type if specified
    if file_type:
        query = query.filter(Library.file_type == file_type)

    # Count total
    total = query.count()

    # Get paginated results
    libraries = query.order_by(desc(Library.created_at)).offset(offset).limit(limit).all()

    data = [
        {
            "id": lib.id,
            "user_id": lib.user_id,
            "name": lib.name,
            "file_type": lib.file_type,
            "size": lib.size,
            "file_path": lib.file_path,
            "tags": lib.tags,
            "created_at": lib.created_at,
            "updated_at": lib.updated_at,
        }
        for lib in libraries
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


@router.post("", response_model=LibraryResponse, status_code=status.HTTP_201_CREATED)
async def upload_library(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload a file to the library."""
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must have a name",
        )

    # Get file extension
    file_name = file.filename
    file_ext = file_name.split(".")[-1].lower() if "." in file_name else "unknown"

    # Read file content and get size
    file_content = await file.read()
    file_size = len(file_content)

    # Create unique filename
    unique_filename = f"{current_user.id}_{datetime.utcnow().timestamp()}_{file_name}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file to disk
    with open(file_path, "wb") as f:
        f.write(file_content)

    # Create library record
    new_library = Library(
        user_id=current_user.id,
        name=file_name,
        file_type=file_ext,
        size=file_size,
        file_path=file_path,
        tags={
            "source": "upload",
            "uploadedAt": datetime.utcnow().isoformat(),
        },
    )
    db.add(new_library)
    db.commit()
    db.refresh(new_library)

    return {
        "id": new_library.id,
        "user_id": new_library.user_id,
        "name": new_library.name,
        "file_type": new_library.file_type,
        "size": new_library.size,
        "file_path": new_library.file_path,
        "tags": new_library.tags,
        "download_url": None,  # Would be signed URL in production
        "created_at": new_library.created_at,
        "updated_at": new_library.updated_at,
    }


@router.get("/{library_id}", response_model=LibraryResponse)
def get_library(
    library_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get library file details and signed download URL."""
    library = (
        db.query(Library)
        .filter(Library.id == library_id, Library.user_id == current_user.id)
        .first()
    )
    if not library:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Library file not found",
        )

    # In production, generate signed S3 URL
    # For now, return relative path
    download_url = f"/api/v1/libraries/{library_id}/download"

    return {
        "id": library.id,
        "user_id": library.user_id,
        "name": library.name,
        "file_type": library.file_type,
        "size": library.size,
        "file_path": library.file_path,
        "tags": library.tags,
        "download_url": download_url,
        "created_at": library.created_at,
        "updated_at": library.updated_at,
    }


@router.delete("/{library_id}")
def delete_library(
    library_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a library file."""
    library = (
        db.query(Library)
        .filter(Library.id == library_id, Library.user_id == current_user.id)
        .first()
    )
    if not library:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Library file not found",
        )

    # Delete file from disk
    if os.path.exists(library.file_path):
        os.remove(library.file_path)

    # Delete database record
    db.delete(library)
    db.commit()

    return {
        "id": library_id,
        "message": "Library file deleted successfully",
    }
