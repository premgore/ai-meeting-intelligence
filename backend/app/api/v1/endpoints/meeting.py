from typing import List

from fastapi import APIRouter

from app.schemas.meeting import (
    CreateMeetingRequest,
    MeetingResponse,
)
from app.services.meeting_service import MeetingService

router = APIRouter()


@router.post(
    "/meetings",
    response_model=MeetingResponse,
)
def create_meeting(request: CreateMeetingRequest):
    return MeetingService.create_meeting(request)


@router.get(
    "/meetings",
    response_model=List[MeetingResponse],
)
def get_all_meetings():
    return MeetingService.get_all_meetings()