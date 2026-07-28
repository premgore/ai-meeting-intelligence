from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting import CreateMeetingRequest
from app.schemas.meeting import UpdateMeetingRequest


class MeetingService:

    @staticmethod
    def create_meeting(
        db: Session,
        request: CreateMeetingRequest,
    ):
        return MeetingRepository.create(
            db=db,
            title=request.title,
            description=request.description,
        )

    @staticmethod
    def get_all_meetings(db: Session):
        return MeetingRepository.get_all(db)

    @staticmethod
    def get_meeting_by_id(
        db: Session,
        meeting_id: int,
    ):
        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )

        return meeting

    @staticmethod
    def update_meeting(
    db: Session,
    meeting_id: int,
    request: UpdateMeetingRequest,
    ):
     meeting = MeetingRepository.get_by_id(db, meeting_id)

     if meeting is None:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found",
        )

     return MeetingRepository.update(
        db=db,
        meeting=meeting,
        title=request.title,
        description=request.description,
    )
    @staticmethod
    def delete_meeting(
    db: Session,
    meeting_id: int,
):
        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )
        MeetingRepository.delete(db, meeting)