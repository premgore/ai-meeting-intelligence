from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.repositories.meeting_repository import MeetingRepository
from app.services.meeting_service import MeetingService


@tool
def summarize_meeting(
    meeting_id: Annotated[
        int,
        "The unique ID of the meeting to get or generate a summary for.",
    ],
    force_regenerate: Annotated[
        bool,
        "Set to True ONLY if the user explicitly requested to regenerate the summary.",
    ] = False,
    deps: ToolDependencies = None,
) -> str:
    """
    Return the summary of a meeting. Returns stored summary if present unless force_regenerate is True.
    """
    logger.info(
        f"Executing summarize_meeting tool for meeting_id={meeting_id}, force_regenerate={force_regenerate}"
    )

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
                f"User {deps.current_user.id} unauthorized for meeting ID={meeting_id}"
            )
            return f"Access denied for meeting ID {meeting_id}."

        # Return existing summary if available and not forced to regenerate
        if meeting.summary and not force_regenerate:
            logger.info(f"Returning stored summary for meeting ID={meeting_id}")
            return f"Summary for Meeting ID {meeting.id} ('{meeting.title}'):\n\n{meeting.summary}"

        # If summary missing or force_regenerate is requested
        if not meeting.transcript:
            return f"Cannot generate summary: Meeting ID {meeting_id} has no transcript. Please transcribe the meeting first."

        logger.info(f"Generating new summary for meeting ID={meeting_id}")
        updated_meeting = MeetingService.summarize_meeting(
            db=deps.db,
            meeting_id=meeting_id,
            current_user=deps.current_user,
        )

        return f"Generated Summary for Meeting ID {updated_meeting.id} ('{updated_meeting.title}'):\n\n{updated_meeting.summary}"

    except Exception as e:
        logger.exception(f"Error in summarize_meeting tool: {str(e)}")
        return f"Error generating or retrieving meeting summary: {str(e)}"
