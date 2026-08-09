from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.repositories.meeting_repository import MeetingRepository


@tool
def get_recent_meetings(
    limit: Annotated[
        int,
        "Maximum number of recent meetings to retrieve. Defaults to 10.",
    ] = 10,
    deps: ToolDependencies = None,
) -> str:
    """
    Retrieve a list of the user's recent meetings with ID, title, created date, and summary preview.
    """
    logger.info(f"Executing get_recent_meetings tool with limit={limit}")

    try:
        meetings = MeetingRepository.get_recent_meetings(
            db=deps.db,
            user_id=deps.current_user.id,
            limit=limit,
        )

        if not meetings:
            logger.info("No meetings found for current user.")
            return "No meetings found."

        result = f"Found {len(meetings)} recent meeting(s):\n\n"

        for meeting in meetings:
            created_str = (
                meeting.created_at.strftime("%Y-%m-%d %H:%M")
                if getattr(meeting, "created_at", None)
                else "N/A"
            )
            summary_preview = (
                (meeting.summary[:150] + "...")
                if meeting.summary and len(meeting.summary) > 150
                else (meeting.summary or "No summary available")
            )

            result += (
                f"• Meeting ID: {meeting.id}\n"
                f"  Title: {meeting.title}\n"
                f"  Created Date: {created_str}\n"
                f"  Summary Preview: {summary_preview}\n\n"
            )

        return result.strip()

    except Exception as e:
        logger.exception(f"Error in get_recent_meetings tool: {str(e)}")
        return f"Error retrieving recent meetings: {str(e)}"
