from langchain_core.tools import StructuredTool

from app.services.email_service import EmailService
from app.repositories.meeting_repository import MeetingRepository


def send_meeting_report(
    db,
    meeting_id: int,
    recipients: list[str],
):
    """
    Send a meeting report by email.
    """

    meeting = MeetingRepository.get_by_id(
        db=db,
        meeting_id=meeting_id,
    )

    if meeting is None:
        return "Meeting not found."

    EmailService.send_meeting_report(
        recipients=recipients,
        subject=f"Meeting Report - {meeting.title}",
        body=(
            f"Hello,\n\n"
            f"Please find the attached AI Meeting Report.\n\n"
            f"Regards,\n"
            f"AI Meeting Intelligence"
        ),
        attachment_path=f"reports/generated/meeting_{meeting.id}_report.pdf",
    )

    return (
        f"Meeting report sent successfully to "
        f"{', '.join(recipients)}"
    )


EmailReportTool = StructuredTool.from_function(
    func=send_meeting_report,
    name="send_meeting_report",
    description=(
        "Send a meeting report PDF to one or more email recipients."
    ),
)