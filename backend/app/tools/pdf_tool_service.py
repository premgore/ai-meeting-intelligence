from sqlalchemy.orm import Session

from app.repositories.meeting_repository import MeetingRepository
from app.services.pdf_service import PDFService


def generate_pdf(
    db: Session,
    meeting_id: int,
) -> str:
    """
    Generate a PDF report for a meeting.
    """

    meeting = MeetingRepository.get_by_id(
        db=db,
        meeting_id=meeting_id,
    )

    if meeting is None:
        return "Meeting not found."

    pdf_path = PDFService.generate_report(
        meeting
    )

    return (
        f"PDF generated successfully.\n\n"
        f"Location:\n{pdf_path}"
    )