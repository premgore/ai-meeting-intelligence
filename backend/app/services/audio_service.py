from pathlib import Path
from uuid import uuid4
import shutil

from fastapi import HTTPException, UploadFile, status


class AudioService:
    # Allowed audio formats
    ALLOWED_EXTENSIONS = {
        ".mp3",
        ".wav",
        ".m4a",
    }

    # Upload directory
    UPLOAD_DIR = Path("app/uploads/audio")

    @classmethod
    def save_audio(cls, file: UploadFile) -> str:
        """
        Validate and save an uploaded audio file.
        Returns the relative file path.
        """

        # Create upload directory if it doesn't exist
        cls.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # Validate filename
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file selected.",
            )

        # Validate extension
        extension = Path(file.filename).suffix.lower()

        if extension not in cls.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only MP3, WAV and M4A files are allowed.",
            )

        # Generate unique filename
        unique_filename = f"{uuid4()}{extension}"

        file_path = cls.UPLOAD_DIR / unique_filename

        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return str(file_path)