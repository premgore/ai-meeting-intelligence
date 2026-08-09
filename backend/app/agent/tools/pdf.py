from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.services.meeting_service import MeetingService


@tool
def generate_pdf_report(
    meeting_id: Annotated[
        int,
        "The unique ID of the meeting to generate a PDF report for.",
    ],
    deps: ToolDependencies = None,
) -> str:
    """
    Generate a PDF report for a meeting using the PDFService and return the file download path.
    """
    logger.info(f"Executing generate_pdf_report tool for meeting_id={meeting_id}")

    try:
        pdf_path = MeetingService.generate_meeting_report(
            db=deps.db,
            meeting_id=meeting_id,
            current_user=deps.current_user,
        )

        logger.info(f"PDF report generated successfully at: {pdf_path}")
        return (
            f"PDF report generated successfully for Meeting ID {meeting_id}.\n"
            f"Download Path: {pdf_path}"
        )

    except Exception as e:
        logger.exception(f"Failed to generate PDF report for meeting ID={meeting_id}: {str(e)}")
        return f"Error generating PDF report: {str(e)}"
