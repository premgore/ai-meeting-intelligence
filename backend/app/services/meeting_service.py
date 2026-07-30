from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.logger import logger
from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting import CreateMeetingRequest
from app.schemas.meeting import UpdateMeetingRequest
from app.models.user import User
from fastapi import UploadFile

from app.services.audio_service import AudioService
from app.services.transcription_service import TranscriptionService
from app.services.summary_service import SummaryService
from app.services.pdf_service import PDFService
from fastapi import HTTPException, status
from app.services.email_service import EmailService
from app.schemas.meeting import SendMeetingReportRequest

class MeetingService:

    @staticmethod
    def create_meeting(
        db: Session,
        request: CreateMeetingRequest,
        current_user: User,
    ):
        logger.info("Creating a new meeting")

        meeting = MeetingRepository.create(
            db=db,
            title=request.title,
            description=request.description,
            user_id=current_user.id,
            
        )

        logger.info(
            f"Meeting created successfully with ID={meeting.id}"
        )

        return meeting

    @staticmethod
    def get_all_meetings(db: Session, current_user: User,):
        meetings = MeetingRepository.get_all(db, user_id=current_user.id)

        logger.info(
            f"Fetched {len(meetings)} meeting(s)"
        )

        return meetings

    @staticmethod
    def get_meeting_by_id(
        db: Session,
        meeting_id: int,
    ):
        logger.info(
            f"Fetching meeting with ID={meeting_id}"
        )

        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            logger.warning(
                f"Meeting not found with ID={meeting_id}"
            )

            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )

        logger.info(
            f"Meeting fetched successfully with ID={meeting_id}"
        )

        return meeting

    @staticmethod
    def update_meeting(
        db: Session,
        meeting_id: int,
        request: UpdateMeetingRequest,
    ):
        logger.info(
            f"Updating meeting with ID={meeting_id}"
        )

        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            logger.warning(
                f"Meeting not found with ID={meeting_id}"
            )

            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )

        meeting = MeetingRepository.update(
            db=db,
            meeting=meeting,
            title=request.title,
            description=request.description,
        )

        logger.info(
            f"Meeting updated successfully with ID={meeting_id}"
        )

        return meeting

    @staticmethod
    def delete_meeting(
        db: Session,
        meeting_id: int,
    ):
        logger.info(
            f"Deleting meeting with ID={meeting_id}"
        )

        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            logger.warning(
                f"Meeting not found with ID={meeting_id}"
            )

            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )

        MeetingRepository.delete(db, meeting)

        logger.info(
            f"Meeting deleted successfully with ID={meeting_id}"
        )

    @staticmethod
    def upload_audio(
        db: Session,
        meeting_id: int,
        file: UploadFile,
        current_user: User,
    ):
        """
        Upload audio for a meeting.
        """

        logger.info(
            f"Uploading audio for meeting ID={meeting_id}"
        )

        meeting = MeetingRepository.get_by_id(
            db,
            meeting_id,
        )

        if meeting is None:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )

        # Verify meeting ownership
        if meeting.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to upload audio for this meeting.",
            )

        # Save audio file
        audio_path = AudioService.save_audio(file)

        # Update database
        meeting = MeetingRepository.update_audio_path(
            db=db,
            meeting=meeting,
            audio_path=audio_path,
        )

        logger.info(
            f"Audio uploaded successfully for meeting ID={meeting_id}"
        )

        return meeting

    @staticmethod
    def transcribe_meeting(
        db: Session,
        meeting_id: int,
        current_user: User,
    ):
        logger.info(f"Starting transcription for meeting ID={meeting_id}")

        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            raise HTTPException(
                status_code=404,
                detail="Meeting not found",
            )

        # Ownership check
        if meeting.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to access this meeting.",
            )

        if not meeting.audio_path:
            raise HTTPException(
                status_code=400,
                detail="No audio uploaded for this meeting.",
            )

        transcript = TranscriptionService.transcribe(
            meeting.audio_path
        )

        meeting = MeetingRepository.update_transcript(
            db=db,
            meeting=meeting,
            transcript=transcript,
        )

        logger.info(
            f"Transcription completed for meeting ID={meeting_id}"
        )

        return meeting

    @staticmethod
    def summarize_meeting(
            db: Session,
            meeting_id: int,
            current_user: User,
        ):
            logger.info(f"Generating AI summary for meeting ID={meeting_id}")

            meeting = MeetingRepository.get_by_id(db, meeting_id)

            if meeting is None:
                raise HTTPException(
                    status_code=404,
                    detail="Meeting not found",
                )

            # Verify ownership
            if meeting.user_id != current_user.id:
                raise HTTPException(
                    status_code=403,
                    detail="You are not allowed to access this meeting.",
                )

            if not meeting.transcript:
                raise HTTPException(
                    status_code=400,
                    detail="Meeting transcript not found. Please transcribe the meeting first.",
                )

            ai_result = SummaryService.generate_summary(
                meeting.transcript
            )

            meeting = MeetingRepository.update_ai_summary(
                db=db,
                meeting=meeting,
                summary=ai_result.get("summary", ""),
                action_items=ai_result.get("action_items", []),
                key_decisions=ai_result.get("key_decisions", []),
                risks=ai_result.get("risks", []),
                sentiment=ai_result.get("sentiment", ""),
            )

            logger.info(
                f"AI summary generated successfully for meeting ID={meeting_id}"
            )

            return meeting

    @staticmethod
    def generate_meeting_report(
        db,
        meeting_id: int,
        current_user,
    ):
        meeting = MeetingRepository.get_by_id(db, meeting_id)

        if meeting is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Meeting not found",
            )

        if meeting.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this meeting",
            )

        pdf_path = PDFService.generate_report(meeting)

        return pdf_path

    @staticmethod
    def send_meeting_report(
            db: Session,
            meeting_id: int,
            current_user: User,
            request: SendMeetingReportRequest,
        ):
            logger.info(
                f"Sending meeting report for meeting ID={meeting_id}"
            )

            meeting = MeetingRepository.get_by_id(
                db,
                meeting_id,
            )

            if meeting is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Meeting not found",
                )

            # Ownership check
            if meeting.user_id != current_user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You are not authorized to access this meeting.",
                )

            # Always generate the latest PDF
            pdf_path = PDFService.generate_report(meeting)

            EmailService.send_meeting_report(
                recipients=request.recipients,
                subject=f"Meeting Report - {meeting.title}",
                body=(
                    f"Hello,\n\n"
                    f"Please find the attached AI meeting report for "
                    f"'{meeting.title}'.\n\n"
                    f"Regards,\n"
                    f"AI Meeting Intelligence"
                ),
                attachment_path=pdf_path,
            )

            logger.info(
                f"Meeting report emailed successfully for meeting ID={meeting_id}"
            )

            return {
                "message": "Meeting report sent successfully."
            }

                