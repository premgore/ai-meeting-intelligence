from langchain_core.tools import StructuredTool

from sqlalchemy.orm import Session

from app.repositories.meeting_repository import MeetingRepository


def get_meeting_details(
    db: Session,
    meeting_id: int,
) -> str:
    """
    Return complete details of a meeting.
    """

    meeting = MeetingRepository.get_by_id(
        db=db,
        meeting_id=meeting_id,
    )

    if meeting is None:
        return "Meeting not found."

    return f"""
Meeting ID:
{meeting.id}

Title:
{meeting.title}

Description:
{meeting.description}

Summary:
{meeting.summary or "No summary"}

Action Items:
{meeting.action_items or []}

Key Decisions:
{meeting.key_decisions or []}

Risks:
{meeting.risks or []}

Sentiment:
{meeting.sentiment or "Unknown"}

Transcript:
{meeting.transcript or "No transcript"}
"""

MeetingDetailsTool = StructuredTool.from_function(
    func=get_meeting_details,
    name="get_meeting_details",
    description=(
        "Return complete information about a meeting."
    ),
)