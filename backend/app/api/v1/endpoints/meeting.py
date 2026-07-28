from typing import List
from fastapi import APIRouter
from app.schemas.common import ApiResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db


from app.schemas.meeting import (
    CreateMeetingRequest,
    MeetingResponse,
)
from app.services.meeting_service import MeetingService

router = APIRouter()


@router.post(
    "/",
    response_model=ApiResponse[MeetingResponse],
)
def create_meeting(
    request: CreateMeetingRequest,
    db: Session = Depends(get_db),
):
    meeting = MeetingService.create_meeting(
        db=db,
        request=request,
    )

    return ApiResponse(
        success=True,
        message="Meeting created successfully",
        data=MeetingResponse.model_validate(meeting),
    )

@router.get(
    "/",
    response_model=ApiResponse[list[MeetingResponse]],
)
def get_meetings(
    db: Session = Depends(get_db),
):
    meetings = MeetingService.get_all_meetings(db)

    return ApiResponse(
        success=True,
        message="Meetings fetched successfully",
        data=[
            MeetingResponse.model_validate(m)
            for m in meetings
        ],
    )