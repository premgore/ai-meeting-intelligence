from app.core.logger import logger
from app.services.semantic_search_service import SemanticSearchService
from app.tools.base_tool import MeetingBaseTool


class SearchMeetingTool(MeetingBaseTool):

    name: str = "search_meetings"

    description: str = (
        "Search the authenticated user's meetings using semantic search. "
        "Use this tool whenever the user asks about previous meetings, "
        "summaries, discussions, action items, decisions, or transcripts."
    )

    def _run(
        self,
        query: str,
    ) -> str:

        logger.info("SearchMeetingTool started.")

        context = self.require_context()

        meetings = SemanticSearchService.search(
            db=context.db,
            current_user=context.current_user,
            query=query,
            limit=5,
        )

        if not meetings:
            return "No relevant meetings found."

        result = ""

        for meeting in meetings:
            result += f"""
Meeting ID: {meeting.id}

Title:
{meeting.title}

Summary:
{meeting.summary or "No summary available"}

----------------------------------------
"""

        logger.info(
            f"SearchMeetingTool returned {len(meetings)} meetings."
        )

        return result