from fastapi import APIRouter, Depends
from sse_starlette.sse import EventSourceResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.chat import ChatRequest
from app.services.streaming_service import StreamingService

router = APIRouter()


@router.post("/chat/stream")
async def stream_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    async def event_generator():

        async for event in StreamingService.stream_answer(
            db=db,
            current_user=current_user,
            question=request.question,
        ):

            yield {
                "event": "message",
                "data": str(event),
            }

    return EventSourceResponse(
        event_generator()
    )