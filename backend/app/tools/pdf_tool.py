from app.repositories.meeting_repository import MeetingRepository
from app.services.pdf_service import PDFService
from app.tools.base_tool import MeetingBaseTool


class GeneratePDFTool(MeetingBaseTool):

    name = "generate_pdf"

    description = "Generate a PDF report for a meeting."

    def _run(
        self,
        meeting_id: int,
    ) -> str:

        meeting = MeetingRepository.get_by_id(
            db=self.context.db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            return "Meeting not found."

        pdf_path = PDFService.generate_report(meeting)

        return pdf_path