from sqlalchemy.orm import Session

from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting import CreateMeetingRequest


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