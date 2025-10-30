"""Application settings and configuration."""

from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings from environment variables."""

    # Database
    # For development: SQLite (file-based, no server needed)
    # For production: Use PostgreSQL (set via .env)
    database_url: str = "sqlite:///./dione_dev.db"

    # JWT
    jwt_secret_key: str = "your-secret-key-min-32-chars-long"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 30

    # AWS S3
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    aws_s3_bucket: Optional[str] = None
    aws_s3_region: str = "us-east-1"

    # Server
    environment: str = "development"
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
