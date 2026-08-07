from sqlalchemy.orm import Session

from app.models.meeting import Meeting


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
    def get_all(
        db: Session,
        user_id: int,
    ) -> list[Meeting]:
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
    def delete(
        db: Session,
        meeting: Meeting,
    ) -> None:
        db.delete(meeting)
        db.commit()

    @staticmethod
    def update_audio_path(
        db: Session,
        meeting: Meeting,
        audio_path: str,
    ) -> Meeting:
        meeting.audio_path = audio_path

        db.commit()
        db.refresh(meeting)

        return meeting

    @staticmethod
    def update_transcript(
        db: Session,
        meeting: Meeting,
        transcript: str,
    ) -> Meeting:
        meeting.transcript = transcript

        db.commit()
        db.refresh(meeting)

        return meeting

    @staticmethod
    def update_ai_summary(
        db: Session,
        meeting: Meeting,
        summary: str,
        action_items: list,
        key_decisions: list,
        risks: list,
        sentiment: str,
        embedding: list[float],
    ) -> Meeting:
        meeting.summary = summary
        meeting.action_items = action_items
        meeting.key_decisions = key_decisions
        meeting.risks = risks
        meeting.sentiment = sentiment
        meeting.embedding = embedding

        db.commit()
        db.refresh(meeting)

        return meeting

    @staticmethod
    def get_all_with_transcripts(
        db: Session,
        user_id: int,
    ) -> list[Meeting]:
        """
        Fetch all meetings for a user that have transcripts.
        Used by the AI Chat feature.
        """

        return (
            db.query(Meeting)
            .filter(
                Meeting.user_id == user_id,
                Meeting.transcript.isnot(None),
            )
            .order_by(Meeting.id.desc())
            .all()
        )

    @staticmethod
    def get_all_with_action_items(
        db: Session,
        user_id: int,
    ) -> list[Meeting]:
        """
        Return all meetings that contain action items.
        """

        return (
            db.query(Meeting)
            .filter(
                Meeting.user_id == user_id,
                Meeting.action_items.isnot(None),
            )
            .order_by(Meeting.id.desc())
            .all()
        )

    @staticmethod
    def get_recent_meetings(
        db: Session,
        user_id: int,
        limit: int = 10,
    ) -> list[Meeting]:
        """
        Return the user's most recent meetings.
        """

        return (
            db.query(Meeting)
            .filter(
                Meeting.user_id == user_id,
            )
            .order_by(Meeting.id.desc())
            .limit(limit)
            .all()
        )