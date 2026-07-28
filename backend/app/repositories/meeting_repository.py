from sqlalchemy.orm import Session

from app.models.meeting import Meeting


class MeetingRepository:
    @staticmethod
    def create(
        db: Session,
        title: str,
        description: str,
    ) -> Meeting:
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
    