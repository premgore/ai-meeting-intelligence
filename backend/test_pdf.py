from app.db.session import SessionLocal
from app.models.meeting import Meeting
from app.services.pdf_service import PDFService

db = SessionLocal()

try:
    # Change this ID if needed
    meeting_id = 12

    meeting = (
        db.query(Meeting)
        .filter(Meeting.id == meeting_id)
        .first()
    )

    if meeting is None:
        print(f"Meeting with ID {meeting_id} not found.")
    else:
        pdf_path = PDFService.generate_report(meeting)

        print("\n===================================")
        print("PDF generated successfully!")
        print(f"Location: {pdf_path}")
        print("===================================\n")

finally:
    db.close()