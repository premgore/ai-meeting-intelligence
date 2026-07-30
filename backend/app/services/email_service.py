import os
import smtplib
from email.message import EmailMessage

from fastapi import HTTPException, status

from app.core.config import settings
from app.core.logger import logger


class EmailService:
    @staticmethod
    def send_meeting_report(
        recipients: list[str],
        subject: str,
        body: str,
        attachment_path: str,
    ) -> None:
        """
        Send meeting report PDF via email.
        """

        if not os.path.exists(attachment_path):
            logger.error(f"Attachment not found: {attachment_path}")

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting report not found.",
            )

        message = EmailMessage()

        message["Subject"] = subject
        message["From"] = settings.SMTP_FROM
        message["To"] = ", ".join(recipients)

        message.set_content(body)

        # Attach PDF
        with open(attachment_path, "rb") as file:
            message.add_attachment(
                file.read(),
                maintype="application",
                subtype="pdf",
                filename=os.path.basename(attachment_path),
            )

        try:
            logger.info("Connecting to SMTP server...")

            with smtplib.SMTP(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
            ) as smtp:

                smtp.starttls()

                smtp.login(
                    settings.SMTP_USERNAME,
                    settings.SMTP_PASSWORD,
                )

                smtp.send_message(message)

            logger.info(
                f"Meeting report sent successfully to {recipients}"
            )

        except Exception as e:
            logger.exception("Failed to send email.")

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to send email: {str(e)}",
            )