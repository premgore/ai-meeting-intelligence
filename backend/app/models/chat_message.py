from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    meeting_id: Mapped[int] = mapped_column(
        ForeignKey("meetings.id"),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    meeting = relationship(
        "Meeting",
        back_populates="chat_messages",
    )