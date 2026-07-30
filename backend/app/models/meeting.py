from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user = relationship(
        "User",
        back_populates="meetings",
    )

    audio_path: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    transcript: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # AI Generated Insights
    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    action_items: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    key_decisions: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    risks: Mapped[list | None] = mapped_column(
        JSON,
        nullable=True,
    )

    sentiment: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )