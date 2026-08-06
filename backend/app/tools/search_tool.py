from app.services.semantic_search_service import SemanticSearchService
from app.tools.base_tool import MeetingBaseTool


class SearchMeetingTool(MeetingBaseTool):

    name = "search_meetings"

    description = (
        "Search meetings using semantic search."
    )

    def _run(
        self,
        query: str,
    ) -> str:

        meetings = SemanticSearchService.search(
            db=self.context.db,
            current_user=self.context.current_user,
            query=query,
            limit=5,
        )

        if not meetings:
            return "No relevant meetings found."

        result = ""

        for meeting in meetings:

            result += f"""
Meeting {meeting.id}

Title:
{meeting.title}

Summary:
{meeting.summary or "No summary"}

------------------------------
"""

        return result