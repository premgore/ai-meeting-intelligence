from app.repositories.meeting_repository import MeetingRepository
from app.tools.base_tool import MeetingBaseTool


class ActionItemsTool(MeetingBaseTool):

    name: str = "get_action_items"

    description: str = (
        "Return action items from previous meetings."
    )

    def _run(self) -> str:

        context = self.require_context()

        meetings = (
            MeetingRepository.get_all_with_action_items(
                context.db,
                context.current_user.id,
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