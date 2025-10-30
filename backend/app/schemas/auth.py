"""Authentication request/response schemas."""

from pydantic import BaseModel
from .user import UserResponse


class TokenResponse(BaseModel):
    """Token response schema."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginResponse(TokenResponse):
    """Login response with user data."""

    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""

    refresh_token: str


class LogoutRequest(BaseModel):
    """Logout request schema."""

    refresh_token: str
