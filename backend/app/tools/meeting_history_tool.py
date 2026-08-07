from app.repositories.meeting_repository import MeetingRepository
from app.tools.base_tool import MeetingBaseTool


class MeetingHistoryTool(MeetingBaseTool):

    name: str = "meeting_history"

    description: str = (
        "Return the user's recent meetings."
    )

    def _run(
        self,
        limit: int = 10,
    ) -> str:

        context = self.require_context()

        meetings = (
            MeetingRepository.get_recent_meetings(
                context.db,
                context.current_user.id,
                limit,
            )
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