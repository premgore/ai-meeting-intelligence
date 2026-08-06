from app.repositories.meeting_repository import MeetingRepository
from app.tools.base_tool import MeetingBaseTool


class MeetingHistoryTool(MeetingBaseTool):

    name = "meeting_history"

    description = "Return recent meetings."

    def _run(
        self,
        limit: int = 10,
    ) -> str:

        meetings = MeetingRepository.get_recent_meetings(
            self.context.db,
            self.context.current_user.id,
            limit,
        )

        if not meetings:
            return "No meetings."

        result = ""

        for meeting in meetings:

            result += (
                f"{meeting.id} - "
                f"{meeting.title}\n"
            )

        return result