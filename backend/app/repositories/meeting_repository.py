from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from backend.app import db
from backend.app.schemas import meeting

class MeetingRepository:
    @staticmethod
    def create(
        db: Session,
        title: str,
        description: str,
        user_id: int,
    ) -> Meeting:
        meeting = Meeting(
            title=title,
            description=description,
            user_id=user_id,
        )

        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        return meeting

    @staticmethod
    def get_all(db: Session) -> list[Meeting]:
        @staticmethod
        def get_all(
            db: Session,
            user_id: int,
        ):
            return (
        db.query(Meeting)
        .filter(Meeting.user_id == user_id)
        .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        meeting_id: int,
    ) -> Meeting | None:
        return (
            db.query(Meeting)
            .filter(Meeting.id == meeting_id)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        meeting: Meeting,
        title: str,
        description: str,
    ) -> Meeting:
        meeting.title = title
        meeting.description = description

        db.commit()
        db.refresh(meeting)

        return meeting 


    @staticmethod
    def delete(db: Session, meeting: Meeting) -> None:
        db.delete(meeting)
        db.commit()

    @staticmethod
    def update_audio_path(
    db: Session,
    meeting: Meeting,
    audio_path: str,
    ):
        meeting.audio_path = audio_path
        db.commit()
        db.refresh(meeting)
        return meeting

    @staticmethod
    def update_transcript(
    db: Session,
    meeting: Meeting,
    transcript: str,
    ):
        meeting.transcript = transcript

        db.commit()
        db.refresh(meeting)

        return meeting