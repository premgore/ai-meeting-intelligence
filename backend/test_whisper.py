from app.services.transcription_service import TranscriptionService

transcript = TranscriptionService.transcribe(
    "app/uploads/audio/9b534099-0fa5-42de-99d2-9e5b9dbb10b9.mp3"
)

print(transcript)