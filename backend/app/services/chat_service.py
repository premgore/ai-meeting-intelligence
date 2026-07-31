from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.groq_client import client
from app.models.user import User
from app.services.semantic_search_service import SemanticSearchService


class ChatService:

    @staticmethod
    def ask_question(
        db: Session,
        current_user: User,
        question: str,
    ) -> str:

        # Retrieve only the most relevant meetings using vector search
        meetings = SemanticSearchService.search(
            db=db,
            current_user=current_user,
            query=question,
            limit=5,
        )

        if not meetings:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No relevant meetings found.",
            )

        context = ""

        for meeting in meetings:
            context += f"""
Meeting ID: {meeting.id}
Meeting Title: {meeting.title}

Transcript:
{meeting.transcript}

Summary:
{meeting.summary or "Not Available"}

Action Items:
{meeting.action_items or []}

Key Decisions:
{meeting.key_decisions or []}

Risks:
{meeting.risks or []}

Sentiment:
{meeting.sentiment or "Unknown"}

---------------------------------------
"""

        prompt = f"""
You are an AI Meeting Assistant.

Answer the user's question ONLY using the meeting information below.

If the answer cannot be found in the provided meetings,
reply exactly:

"I couldn't find that information in your meetings."

Meeting Context:

{context}

User Question:

{question}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content.strip()