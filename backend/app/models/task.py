"""Task database model."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class TaskPriority(str, enum.Enum):
    """Task priority levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


class TaskCategory(str, enum.Enum):
    """Task categories."""
    PERSONAL = "PERSONAL"
    WORK = "WORK"
    SHOPPING = "SHOPPING"
    HEALTH = "HEALTH"
    LEARNING = "LEARNING"
    PROJECT = "PROJECT"
    OTHER = "OTHER"


class Task(Base):
    """Task model for todo items."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    priority = Column(SQLEnum(TaskPriority), default=TaskPriority.MEDIUM, nullable=False)
    category = Column(SQLEnum(TaskCategory), default=TaskCategory.OTHER, nullable=False)
    due_date = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationship to user
    owner = relationship("User", back_populates="tasks")

    def __repr__(self) -> str:
        status = "✓" if self.completed else " "
        return f"<Task(id={self.id}, title='{self.title}', priority={self.priority.value}, completed=[{status}])>"
