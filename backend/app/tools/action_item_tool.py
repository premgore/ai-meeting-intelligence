from app.repositories.meeting_repository import MeetingRepository
from app.tools.base_tool import MeetingBaseTool


class ActionItemsTool(MeetingBaseTool):

    name = "get_action_items"

    description = "Return action items."

    def _run(self) -> str:

        meetings = (
            MeetingRepository.get_all_with_action_items(
                self.context.db,
                self.context.current_user.id,
            )
        )

        if not meetings:
            return "No action items."

        result = ""

        for meeting in meetings:

            result += f"\n{meeting.title}\n"

            for item in meeting.action_items or []:
                result += f"- {item}\n"

        return result