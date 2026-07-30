from fastapi import (
    APIRouter,
    File,
    UploadFile,
)

from app.services.audio_service import AudioService

router = APIRouter(
    tags=["Audio Upload"],
)


@router.post("/upload-audio")
def upload_audio(
    file: UploadFile = File(...),
):
    """
    Upload an audio file.
    """

    saved_path = AudioService.save_audio(file)

    return {
        "message": "Audio uploaded successfully.",
        "file_name": file.filename,
        "saved_path": saved_path,
    }