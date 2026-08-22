from typing import Annotated

from langchain.tools import tool, ToolRuntime

from app.agent.context import AgentContext, extract_context
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
    runtime: ToolRuntime[AgentContext] | None = None,
    deps: ToolDependencies | None = None,
) -> str:
    """
    Return the summary of a meeting. Returns stored summary if present
    unless force_regenerate is True.
    """
    logger.info(
        f"Executing summarize_meeting tool "
        f"for meeting_id={meeting_id}, "
        f"force_regenerate={force_regenerate}"
    )

    try:
        ctx = extract_context(runtime, deps)
        if not ctx:
            return "Error: Runtime context or dependencies missing."

        db = ctx.db
        current_user = ctx.current_user

        meeting = MeetingRepository.get_by_id(
            db=db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            logger.warning(
                f"Meeting with ID={meeting_id} not found."
            )
            return (
                f"Meeting with ID {meeting_id} not found."
            )

        if meeting.user_id != current_user.id:
            logger.warning(
                f"User {current_user.id} unauthorized "
                f"for meeting ID={meeting_id}"
            )
            return (
                f"Access denied for meeting ID {meeting_id}."
            )

        if meeting.summary and not force_regenerate:
            logger.info(
                f"Returning stored summary "
                f"for meeting ID={meeting_id}"
            )

            return (
                f"Summary for Meeting ID {meeting.id} "
                f"('{meeting.title}'):\n\n"
                f"{meeting.summary}"
            )

        if not meeting.transcript:
            return (
                f"Cannot generate summary: Meeting ID "
                f"{meeting_id} has no transcript. "
                f"Please transcribe the meeting first."
            )

        logger.info(
            f"Generating new summary "
            f"for meeting ID={meeting_id}"
        )

        updated_meeting = MeetingService.summarize_meeting(
            db=db,
            meeting_id=meeting_id,
            current_user=current_user,
        )

        return (
            f"Generated Summary for Meeting ID "
            f"{updated_meeting.id} "
            f"('{updated_meeting.title}'):\n\n"
            f"{updated_meeting.summary}"
        )

    except Exception as e:
        logger.exception(
            f"Error in summarize_meeting tool: {str(e)}"
        )
        return (
            f"Error generating or retrieving meeting summary: "
            f"{str(e)}"
        )
