"""Artifact model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Artifact(Base):
    """Artifact (scratchpad tab) model."""

    __tablename__ = "artifacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    file_type = Column(String(50), nullable=True)  # python, javascript, markdown, etc.
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(512), nullable=True)  # S3 path
    history = Column(JSON, default=[])  # Previous versions (as JSON array)
    history_index = Column(Integer, default=0)  # Current position
    published = Column(Boolean, default=False)
    share_token = Column(String(255), unique=True, nullable=True)
    views = Column(Integer, default=0)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="artifacts")
