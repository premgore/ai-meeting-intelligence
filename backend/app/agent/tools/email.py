from typing import Annotated

from langchain.tools import tool, ToolRuntime

from app.agent.context import AgentContext, extract_context
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
    runtime: ToolRuntime[AgentContext] | None = None,
    deps: ToolDependencies | None = None,
) -> str:
    """
    Generate a PDF report for a meeting and email it
    to one or more recipients.
    """
    logger.info(
        f"Executing email_meeting_report tool "
        f"for meeting_id={meeting_id}, "
        f"recipients={recipients}"
    )

    try:
        ctx = extract_context(runtime, deps)
        if not ctx:
            return "Error: Runtime context or dependencies missing."

        db = ctx.db
        current_user = ctx.current_user

        # Normalize recipients into a list
        if isinstance(recipients, str):
            recipient_list = [
                email.strip()
                for email in recipients
                .replace(",", " ")
                .split()
                if email.strip()
            ]

        elif isinstance(recipients, list):
            recipient_list = [
                str(r).strip()
                for r in recipients
                if str(r).strip()
            ]

        else:
            return (
                "Error: Invalid recipients format provided."
            )

        if not recipient_list:
            return (
                "Error: At least one recipient email "
                "address must be provided."
            )

        request_schema = SendMeetingReportRequest(
            recipients=recipient_list
        )

        result = MeetingService.send_meeting_report(
            db=db,
            meeting_id=meeting_id,
            current_user=current_user,
            request=request_schema,
        )

        recipients_str = ", ".join(
            recipient_list
        )

        logger.info(
            f"Meeting report emailed successfully "
            f"to {recipients_str}"
        )

        return (
            f"Meeting report for Meeting ID "
            f"{meeting_id} emailed successfully to: "
            f"{recipients_str}."
        )

    except Exception as e:
        logger.exception(
            f"Failed to email meeting report "
            f"for meeting ID={meeting_id}: {str(e)}"
        )
        return (
            f"Error emailing meeting report: {str(e)}"
        )
