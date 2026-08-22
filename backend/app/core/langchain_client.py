from langchain_groq import ChatGroq

from app.core.config import settings


llm = ChatGroq(
    model="openai/gpt-oss-120b",
    groq_api_key=settings.GROQ_API_KEY,
    temperature=0.2,
)