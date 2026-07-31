from sentence_transformers import SentenceTransformer


class EmbeddingService:
    """
    Service for generating text embeddings using a local SentenceTransformer model.
    """

    # Model loads once when the application starts
    model = SentenceTransformer("all-MiniLM-L6-v2")

    @classmethod
    def generate_embedding(cls, text: str) -> list[float]:
        """
        Generate a 384-dimensional embedding.
        """
        embedding = cls.model.encode(
            text,
            normalize_embeddings=True,
        )

        return embedding.tolist()