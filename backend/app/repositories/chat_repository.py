from sqlalchemy.orm import Session

from app.models.chat_message import ChatMessage


class ChatRepository:

    @staticmethod
    def save_message(
        db: Session,
        meeting_id: int,
        role: str,
        message: str,
    ) -> ChatMessage:

        chat = ChatMessage(
            meeting_id=meeting_id,
            role=role,
            message=message,
        )

        db.add(chat)
        db.commit()
        db.refresh(chat)

        return chat

    @staticmethod
    def get_recent_messages(
        db: Session,
        meeting_id: int,
        limit: int = 10,
    ) -> list[ChatMessage]:

        return (
            db.query(ChatMessage)
            .filter(ChatMessage.meeting_id == meeting_id)
            .order_by(ChatMessage.created_at.desc())
            .limit(limit)
            .all()[::-1]
        )

    @staticmethod
    def clear_chat(
        db: Session,
        meeting_id: int,
    ):

        (
            db.query(ChatMessage)
            .filter(ChatMessage.meeting_id == meeting_id)
            .delete()
        )

        db.commit()