from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting import SendMeetingReportRequest
from app.services.email_service import EmailService
from app.services.pdf_service import PDFService
from app.tools.base_tool import MeetingBaseTool


class EmailReportTool(MeetingBaseTool):

    name: str = "email_meeting_report"

    description: str = (
        "Generate a PDF meeting report and email it to one or more recipients."
    )

    def _run(
        self,
        meeting_id: int,
        email: str,
    ) -> str:

        context = self.require_context()

        meeting = MeetingRepository.get_by_id(
            db=context.db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            return "Meeting not found."

        pdf_path = PDFService.generate_report(
            meeting
        )

        request = SendMeetingReportRequest(
            recipients=[email]
        )

        EmailService.send_meeting_report(
            recipients=request.recipients,
            subject=f"Meeting Report - {meeting.title}",
            body=(
                f"Please find attached the meeting report for "
                f"'{meeting.title}'."
            ),
            attachment_path=pdf_path,
        )

        return f"Meeting report emailed successfully to {email}."