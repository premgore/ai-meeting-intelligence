import whisper

from app.core.logger import logger


class TranscriptionService:
    """
    Service for converting speech to text using OpenAI Whisper.
    """

    # Load the model only once when the application starts
    model = whisper.load_model("base")

    @staticmethod
    def transcribe(audio_path: str) -> str:
        """
        Transcribe an audio file and return the transcript.
        """

        logger.info(f"Starting transcription: {audio_path}")

        result = TranscriptionService.model.transcribe(audio_path)

        transcript = result["text"].strip()

        logger.info("Transcription completed successfully.")

        return transcript