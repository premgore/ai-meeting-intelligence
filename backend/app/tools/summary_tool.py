from app.repositories.meeting_repository import MeetingRepository
from app.services.summary_service import SummaryService
from app.tools.base_tool import MeetingBaseTool


class SummaryTool(MeetingBaseTool):

    name: str = "summarize_meeting"

    description: str = (
        "Generate a summary for a meeting."
    )

    def _run(
        self,
        meeting_id: int,
    ) -> str:

        context = self.require_context()

        meeting = MeetingRepository.get_by_id(
            db=context.db,
            meeting_id=meeting_id,
        )

        if meeting is None:
            return "Meeting not found."

        if not meeting.transcript:
            return "Meeting transcript not found."

        result = SummaryService.generate_summary(
            meeting.transcript
        )

        return result["summary"]