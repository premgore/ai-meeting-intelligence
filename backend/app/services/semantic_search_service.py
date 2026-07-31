from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.vector_repository import VectorRepository
from app.services.embedding_service import EmbeddingService


class SemanticSearchService:
    @staticmethod
    def search(
        db: Session,
        current_user: User,
        query: str,
        limit: int = 5,
    ):
        """
        Generate an embedding for the user's question and
        retrieve the most semantically similar meetings.
        """

        query_embedding = EmbeddingService.generate_embedding(query)

        meetings = VectorRepository.search_similar_meetings(
            db=db,
            user_id=current_user.id,
            query_embedding=query_embedding,
            limit=limit,
        )

        return meetings