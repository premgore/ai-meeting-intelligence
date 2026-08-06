from sqlalchemy.orm import Session

from app.models.user import User
from app.services.semantic_search_service import SemanticSearchService


def search_meetings(
    db: Session,
    current_user: User,
    query: str,
) -> str:

    meetings = SemanticSearchService.search(
        db=db,
        current_user=current_user,
        query=query,
        limit=5,
    )

    if not meetings:
        return "No relevant meetings found."

    result = ""

    for meeting in meetings:

        result += f"""
Meeting ID: {meeting.id}

Title:
{meeting.title}

Summary:
{meeting.summary or "No summary"}

--------------------------------
"""

    return result