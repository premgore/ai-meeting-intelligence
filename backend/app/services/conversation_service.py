from langchain_core.messages import AIMessage, HumanMessage

from sqlalchemy.orm import Session

from app.repositories.chat_repository import ChatRepository


class ConversationService:
    """
    Handles loading and saving conversation history
    for a specific meeting.
    """

    @staticmethod
    def load_history(
        db: Session,
        meeting_id: int,
    ):
        messages = ChatRepository.get_recent_messages(
            db=db,
            meeting_id=meeting_id,
            limit=10,
        )

        history = []

        for msg in messages:

            if msg.role == "user":
                history.append(
                    HumanMessage(content=msg.message)
                )

            else:
                history.append(
                    AIMessage(content=msg.message)
                )

        return history

    @staticmethod
    def save_user_message(
        db: Session,
        meeting_id: int,
        message: str,
    ):
        ChatRepository.save_message(
            db=db,
            meeting_id=meeting_id,
            role="user",
            message=message,
        )

    @staticmethod
    def save_ai_message(
        db: Session,
        meeting_id: int,
        message: str,
    ):
        ChatRepository.save_message(
            db=db,
            meeting_id=meeting_id,
            role="assistant",
            message=message,
        )

    @staticmethod
    def clear_history(
        db: Session,
        meeting_id: int,
    ):
        ChatRepository.clear_chat(
            db=db,
            meeting_id=meeting_id,
        )