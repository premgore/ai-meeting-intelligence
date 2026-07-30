import os

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate

from app.models.meeting import Meeting


class PDFService:
    REPORT_DIR = "reports/generated"

    @staticmethod
    def generate_report(meeting: Meeting) -> str:
        os.makedirs(PDFService.REPORT_DIR, exist_ok=True)

        filename = f"meeting_{meeting.id}_report.pdf"
        filepath = os.path.join(PDFService.REPORT_DIR, filename)

        doc = SimpleDocTemplate(filepath)

        styles = getSampleStyleSheet()

        story = []

        story.append(Paragraph("<b>AI Meeting Report</b>", styles["Title"]))
        story.append(Paragraph("<br/><br/>", styles["Normal"]))

        story.append(
            Paragraph(f"<b>Meeting Title:</b> {meeting.title}", styles["Heading2"])
        )

        story.append(
            Paragraph(
                f"<b>Description:</b> {meeting.description}",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph("<br/>", styles["Normal"])
        )

        story.append(
            Paragraph("<b>AI Summary</b>", styles["Heading2"])
        )

        story.append(
            Paragraph(
                meeting.summary or "No summary available.",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph("<br/>", styles["Normal"])
        )

        story.append(
            Paragraph("<b>Action Items</b>", styles["Heading2"])
        )

        if meeting.action_items:
            for item in meeting.action_items:
                story.append(
                    Paragraph(f"• {item}", styles["BodyText"])
                )
        else:
            story.append(
                Paragraph("No action items.", styles["BodyText"])
            )

        story.append(
            Paragraph("<br/>", styles["Normal"])
        )

        story.append(
            Paragraph("<b>Key Decisions</b>", styles["Heading2"])
        )

        if meeting.key_decisions:
            for item in meeting.key_decisions:
                story.append(
                    Paragraph(f"• {item}", styles["BodyText"])
                )
        else:
            story.append(
                Paragraph("No key decisions.", styles["BodyText"])
            )

        story.append(
            Paragraph("<br/>", styles["Normal"])
        )

        story.append(
            Paragraph("<b>Risks</b>", styles["Heading2"])
        )

        if meeting.risks:
            for item in meeting.risks:
                story.append(
                    Paragraph(f"• {item}", styles["BodyText"])
                )
        else:
            story.append(
                Paragraph("No risks identified.", styles["BodyText"])
            )

        story.append(
            Paragraph("<br/>", styles["Normal"])
        )

        story.append(
            Paragraph("<b>Sentiment</b>", styles["Heading2"])
        )

        story.append(
            Paragraph(
                meeting.sentiment or "Unknown",
                styles["BodyText"],
            )
        )

        story.append(
            Paragraph("<br/>", styles["Normal"])
        )

        story.append(
            Paragraph("<b>Transcript</b>", styles["Heading2"])
        )

        story.append(
            Paragraph(
                meeting.transcript or "No transcript available.",
                styles["BodyText"],
            )
        )

        doc.build(story)

        return filepath