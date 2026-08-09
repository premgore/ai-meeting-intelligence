from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.repositories.meeting_repository import MeetingRepository


@tool
def get_meeting_details(
    meeting_id: Annotated[
        int,
        "The unique ID of the meeting to fetch complete details for.",
    ],
    deps: ToolDependencies = None,
) -> str:
    """
    Retrieve complete details for a specific meeting by ID including title, description, transcript, summary, action items, key decisions, risks, sentiment, and created date.
    """
    logger.info(f"Executing get_meeting_details tool for meeting_id={meeting_id}")

    try:
        meeting = MeetingRepository.get_by_id(
            db=deps.db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            logger.warning(f"Meeting with ID={meeting_id} not found.")
            return f"Meeting with ID {meeting_id} not found."

        if meeting.user_id != deps.current_user.id:
            logger.warning(
                f"User {deps.current_user.id} unauthorized to view meeting ID={meeting_id}"
            )
            return f"Access denied for meeting ID {meeting_id}."

        created_str = (
            meeting.created_at.strftime("%Y-%m-%d %H:%M:%S")
            if getattr(meeting, "created_at", None)
            else "N/A"
        )

        action_items_str = (
            "\n".join([f"  - {item}" for item in meeting.action_items])
            if meeting.action_items
            else "  None"
        )
        key_decisions_str = (
            "\n".join([f"  - {item}" for item in meeting.key_decisions])
            if meeting.key_decisions
            else "  None"
        )
        risks_str = (
            "\n".join([f"  - {item}" for item in meeting.risks])
            if meeting.risks
            else "  None"
        )

        details = f"""Meeting Details (ID: {meeting.id}):

Title: {meeting.title}
Created Date: {created_str}
Description: {meeting.description or "No description provided"}
Sentiment: {meeting.sentiment or "Not analyzed"}

Summary:
{meeting.summary or "No summary available"}

Action Items:
{action_items_str}

Key Decisions:
{key_decisions_str}

Risks:
{risks_str}

Transcript:
{meeting.transcript or "No transcript available"}
"""
        return details.strip()

    except Exception as e:
        logger.exception(f"Error in get_meeting_details tool: {str(e)}")
        return f"Error retrieving meeting details: {str(e)}"
