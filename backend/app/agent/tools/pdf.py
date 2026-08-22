from typing import Annotated

from langchain.tools import tool, ToolRuntime

from app.agent.context import AgentContext, extract_context
from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.services.meeting_service import MeetingService


@tool
def generate_pdf_report(
    meeting_id: Annotated[
        int,
        "The unique ID of the meeting to generate a PDF report for.",
    ],
    runtime: ToolRuntime[AgentContext] | None = None,
    deps: ToolDependencies | None = None,
) -> str:
    """
    Generate a PDF report for a meeting using the PDFService
    and return the file download path.
    """
    logger.info(
        f"Executing generate_pdf_report tool "
        f"for meeting_id={meeting_id}"
    )

    try:
        ctx = extract_context(runtime, deps)
        if not ctx:
            return "Error: Runtime context or dependencies missing."

        db = ctx.db
        current_user = ctx.current_user

        pdf_path = MeetingService.generate_meeting_report(
            db=db,
            meeting_id=meeting_id,
            current_user=current_user,
        )

        logger.info(
            f"PDF report generated successfully "
            f"at: {pdf_path}"
        )

        return (
            f"PDF report generated successfully "
            f"for Meeting ID {meeting_id}.\n"
            f"Download Path: {pdf_path}"
        )

    except Exception as e:
        logger.exception(
            f"Failed to generate PDF report "
            f"for meeting ID={meeting_id}: {str(e)}"
        )
        return (
            f"Error generating PDF report: {str(e)}"
        )
