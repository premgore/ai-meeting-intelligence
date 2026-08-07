from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.agent_v2.meeting_agent import MeetingAgent
from app.models.user import User
from app.repositories.meeting_repository import MeetingRepository
from app.services.conversation_service import ConversationService


class ChatService:

    @staticmethod
    def ask_question(
        db: Session,
        current_user: User,
        meeting_id: int,
        question: str,
    ) -> str:

        # Verify meeting exists
        meeting = MeetingRepository.get_by_id(
            db=db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting not found.",
            )

        if meeting.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized.",
            )

        # Save user message
        ConversationService.save_user_message(
            db=db,
            meeting_id=meeting_id,
            message=question,
        )

        # Create agent
        agent = MeetingAgent()

        # Ask agent
        answer = agent.invoke(
            db=db,
            current_user=current_user,
            query=question,
        )

        # Save AI response
        ConversationService.save_ai_message(
            db=db,
            meeting_id=meeting_id,
            message=answer,
        )

        return answer