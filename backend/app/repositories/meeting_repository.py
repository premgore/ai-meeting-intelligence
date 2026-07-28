from sqlalchemy.orm import Session

from app.models.meeting import Meeting


class MeetingRepository:
    @staticmethod
    def create(db: Session, title: str, description: str) -> Meeting:
        meeting = Meeting(
            title=title,
            description=description,
        )

        db.add(meeting)
        db.commit()
        db.refresh(meeting)

        return meeting

    @staticmethod
    def get_all(db: Session) -> list[Meeting]:
        return db.query(Meeting).all()