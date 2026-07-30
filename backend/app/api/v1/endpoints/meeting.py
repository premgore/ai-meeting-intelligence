from typing import List
from fastapi import APIRouter
from app.schemas.common import ApiResponse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.meeting import UpdateMeetingRequest
from fastapi import Depends
from app.core.security import get_current_user
from app.models.user import User
from fastapi import UploadFile, File

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
    current_user: User = Depends(get_current_user),
):
    meeting = MeetingService.create_meeting(
        db=db,
        request=request,
        current_user=current_user,
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
    current_user: User = Depends(get_current_user),
):
    meetings = MeetingService.get_all_meetings(db,current_user=current_user,)

    return ApiResponse(
        success=True,
        message="Meetings fetched successfully",
        data=[
            MeetingResponse.model_validate(m)
            for m in meetings
        ],
    )


@router.get(
    "/{meeting_id}",
    response_model=ApiResponse[MeetingResponse],
)
def get_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meeting = MeetingService.get_meeting_by_id(
        db,
        meeting_id,
        current_user=current_user,
    )

    return ApiResponse(
        success=True,
        message="Meeting fetched successfully",
        data=MeetingResponse.model_validate(meeting),
    )

@router.put(
    "/{meeting_id}",
    response_model=ApiResponse[MeetingResponse],
)
def update_meeting(
    meeting_id: int,
    request: UpdateMeetingRequest,
    db: Session = Depends(get_db),
):
    meeting = MeetingService.update_meeting(
        db=db,
        meeting_id=meeting_id,
        request=request,
    )

    return ApiResponse(
        success=True,
        message="Meeting updated successfully",
        data=MeetingResponse.model_validate(meeting),
    )

@router.delete(
    "/{meeting_id}",
    response_model=ApiResponse[None],
)
def delete_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
):
    MeetingService.delete_meeting(
        db=db,
        meeting_id=meeting_id,
    )

    return ApiResponse(
        success=True,
        message="Meeting deleted successfully",
        data=None,
    )

@router.post(
    "/{meeting_id}/upload-audio",
    response_model=ApiResponse[MeetingResponse],
)
def upload_audio(
    meeting_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload an audio file for a meeting.
    """

    meeting = MeetingService.upload_audio(
        db=db,
        meeting_id=meeting_id,
        file=file,
        current_user=current_user,
    )

    return ApiResponse(
        success=True,
        message="Audio uploaded successfully",
        data=MeetingResponse.model_validate(meeting),
    )

@router.post(
    "/{meeting_id}/transcribe",
    response_model=ApiResponse[MeetingResponse],
)
def transcribe_meeting(
    meeting_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    meeting = MeetingService.transcribe_meeting(
        db=db,
        meeting_id=meeting_id,
        current_user=current_user,
    )

    return ApiResponse(
        success=True,
        message="Meeting transcribed successfully",
        data=MeetingResponse.model_validate(meeting),
    )

