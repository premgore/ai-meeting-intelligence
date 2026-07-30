from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.logger import logger
from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting import CreateMeetingRequest
from app.schemas.meeting import UpdateMeetingRequest
from app.models.user import User
from fastapi import UploadFile

from app.services.audio_service import AudioService


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