"""Task model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Task(Base):
    """Task model."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(50), default="medium")  # high, medium, low
    status = Column(String(50), default="not_started")  # not_started, in_progress, completed
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    archived_at = Column(DateTime, nullable=True)
    tags = Column(JSON, default=[])  # List of tags
    meta_data = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="tasks")
    project = relationship("Project", back_populates="tasks")
