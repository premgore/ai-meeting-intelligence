from app.repositories.meeting_repository import MeetingRepository
from app.services.pdf_service import PDFService
from app.tools.base_tool import MeetingBaseTool


class GeneratePDFTool(MeetingBaseTool):

    name: str = "generate_pdf"

    description: str = (
        "Generate a PDF report for a meeting."
    )

    def _run(
        self,
        meeting_id: int,
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

        return pdf_path