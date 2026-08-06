from app.repositories.meeting_repository import MeetingRepository
from app.services.summary_service import SummaryService
from app.tools.base_tool import MeetingBaseTool


class SummaryTool(MeetingBaseTool):

    name = "summarize_meeting"

    description = "Generate a meeting summary."

    def _run(
        self,
        meeting_id: int,
    ) -> str:

        meeting = MeetingRepository.get_by_id(
            db=self.context.db,
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