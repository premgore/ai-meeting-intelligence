from app.repositories.meeting_repository import MeetingRepository
from app.services.email_service import EmailService
from app.services.pdf_service import PDFService
from app.tools.base_tool import MeetingBaseTool


class EmailReportTool(MeetingBaseTool):

    name = "send_meeting_report"

    description = "Generate and email a meeting report."

    def _run(
        self,
        meeting_id: int,
        email: str,
    ) -> str:

        meeting = MeetingRepository.get_by_id(
            db=self.context.db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            return "Meeting not found."

        pdf_path = PDFService.generate_report(meeting)

        EmailService.send_meeting_report(
            recipients=[email],
            subject=f"Meeting Report - {meeting.title}",
            body="Please find the attached meeting report.",
            attachment_path=pdf_path,
        )

        return "Meeting report emailed successfully."