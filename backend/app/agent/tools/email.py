from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.schemas.meeting import SendMeetingReportRequest
from app.services.meeting_service import MeetingService


@tool
def email_meeting_report(
    meeting_id: Annotated[
        int,
        "The unique ID of the meeting report to email.",
    ],
    recipients: Annotated[
        list[str] | str,
        "Recipient email address or list of recipient email addresses.",
    ],
    deps: ToolDependencies = None,
) -> str:
    """
    Generate a PDF report for a meeting and email it to one or more recipients.
    """
    logger.info(
        f"Executing email_meeting_report tool for meeting_id={meeting_id}, recipients={recipients}"
    )

    try:
        # Normalize recipients input to a list of non-empty strings
        if isinstance(recipients, str):
            recipient_list = [
                email.strip()
                for email in recipients.replace(",", " ").split()
                if email.strip()
            ]
        elif isinstance(recipients, list):
            recipient_list = [str(r).strip() for r in recipients if str(r).strip()]
        else:
            return "Error: Invalid recipients format provided."

        if not recipient_list:
            return "Error: At least one recipient email address must be provided."

        request_schema = SendMeetingReportRequest(recipients=recipient_list)

        result = MeetingService.send_meeting_report(
            db=deps.db,
            meeting_id=meeting_id,
            current_user=deps.current_user,
            request=request_schema,
        )

        recipients_str = ", ".join(recipient_list)
        logger.info(f"Meeting report emailed successfully to {recipients_str}")
        return f"Meeting report for Meeting ID {meeting_id} emailed successfully to: {recipients_str}."

    except Exception as e:
        logger.exception(f"Failed to email meeting report for meeting ID={meeting_id}: {str(e)}")
        return f"Error emailing meeting report: {str(e)}"
