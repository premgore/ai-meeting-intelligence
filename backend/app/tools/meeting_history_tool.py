from langchain_core.tools import StructuredTool

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.meeting_repository import MeetingRepository


def get_meeting_history(
    db: Session,
    current_user: User,
    limit: int = 10,
) -> str:
    """
    Return the user's recent meetings.
    """

    meetings = MeetingRepository.get_recent_meetings(
        db=db,
        user_id=current_user.id,
        limit=limit,
    )

    if not meetings:
        return "No meetings found."

    result = ""

    for meeting in meetings:

        result += f"""
Meeting ID: {meeting.id}

Title:
{meeting.title}

Summary:
{meeting.summary or "No summary available"}

----------------------------------------
"""

    return result


MeetingHistoryTool = StructuredTool.from_function(
    func=get_meeting_history,
    name="get_meeting_history",
    description=(
        "Return the user's recent meeting history."
    ),
)