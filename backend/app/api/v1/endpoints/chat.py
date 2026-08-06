from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post(
    "/chat",
    response_model=ApiResponse[ChatResponse],
)
def chat_with_meetings(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    answer = ChatService.ask_question(
    db=db,
    current_user=current_user,
    meeting_id=request.meeting_id,
    question=request.question,
    )

    return ApiResponse(
        success=True,
        message="Answer generated successfully",
        data=ChatResponse(answer=answer),
    )