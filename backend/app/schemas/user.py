"""User request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    display_name: str


class UserCreate(UserBase):
    """User creation schema."""

    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")


class UserLogin(BaseModel):
    """User login schema."""

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update schema."""

    display_name: Optional[str] = None
    theme: Optional[str] = None
    preferences: Optional[dict] = None


class UserResponse(UserBase):
    """User response schema."""

    id: int
    theme: str
    role: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    password_last_updated: datetime

    class Config:
        from_attributes = True
