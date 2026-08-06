from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.conversation_service import ConversationService
from app.services.rag_service import RAGService
from app.services.semantic_search_service import SemanticSearchService


class ChatService:

    @staticmethod
    def ask_question(
        db: Session,
        current_user: User,
        meeting_id: int,
        question: str,
    ) -> str:

        # Save user message
        ConversationService.save_user_message(
            db=db,
            meeting_id=meeting_id,
            message=question,
        )

        # Load conversation history
        history = ConversationService.load_history(
            db=db,
            meeting_id=meeting_id,
        )

        # Retrieve relevant meetings
        meetings = SemanticSearchService.search(
            db=db,
            current_user=current_user,
            query=question,
            limit=5,
        )

        if not meetings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No relevant meetings found.",
            )

        # Build RAG context
        context = RAGService.build_context(
            meetings
        )

        # Generate AI response
        answer = RAGService.generate_answer(
            context=context,
            history=history,
            question=question,
        )

        # Save assistant response
        ConversationService.save_ai_message(
            db=db,
            meeting_id=meeting_id,
            message=answer,
        )

        return answer