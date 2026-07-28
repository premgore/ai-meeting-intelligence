from typing import List
from fastapi import APIRouter
from app.schemas.common import ApiResponse


from app.schemas.meeting import (
    CreateMeetingRequest,
    MeetingResponse,
)
from app.services.meeting_service import MeetingService

router = APIRouter()


@router.post(
    "/meetings",
    response_model=ApiResponse[MeetingResponse],
)
def create_meeting(request: CreateMeetingRequest):
    meeting = MeetingService.create_meeting(request)

    return ApiResponse(
        success=True,
        message="Meeting created successfully",
        data=MeetingResponse(**meeting),
    )

@router.get(
    "/meetings",
    response_model=ApiResponse[list[MeetingResponse]],
)
def get_all_meetings():
    meetings = MeetingService.get_all_meetings()

    return ApiResponse(
        success=True,
        message="Meetings fetched successfully",
        data=[MeetingResponse(**meeting) for meeting in meetings],
    )