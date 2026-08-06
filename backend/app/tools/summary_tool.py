from langchain_core.tools import StructuredTool

from sqlalchemy.orm import Session

from app.repositories.meeting_repository import MeetingRepository
from app.services.summary_service import SummaryService


def summarize_meeting(
    db: Session,
    meeting_id: int,
) -> str:
    """
    Generate an AI summary for a meeting.
    """

    meeting = MeetingRepository.get_by_id(
        db=db,
        meeting_id=meeting_id,
    )

    if meeting is None:
        return "Meeting not found."

    if not meeting.transcript:
        return "Meeting transcript not found."

    result = SummaryService.generate_summary(
        meeting.transcript
    )

    return f"""
Summary

{result.get("summary", "")}

--------------------------------

Action Items

{result.get("action_items", [])}

--------------------------------

Key Decisions

{result.get("key_decisions", [])}

--------------------------------

Risks

{result.get("risks", [])}

--------------------------------

Sentiment

{result.get("sentiment", "")}
"""

SummaryTool = StructuredTool.from_function(
    func=summarize_meeting,
    name="summarize_meeting",
    description=(
        "Generate an AI summary for a meeting."
    ),
)