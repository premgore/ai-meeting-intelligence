from sqlalchemy.orm import Session
from pgvector.sqlalchemy import Vector

from app.models.meeting import Meeting


class VectorRepository:
    @staticmethod
    def search_similar_meetings(
        db: Session,
        user_id: int,
        query_embedding: list[float],
        limit: int = 5,
    ):
        """
        Returns the most semantically similar meetings.
        """

        return (
            db.query(Meeting)
            .filter(
                Meeting.user_id == user_id,
                Meeting.embedding.isnot(None),
            )
            .order_by(
                Meeting.embedding.cosine_distance(query_embedding)
            )
            .limit(limit)
            .all()
        )