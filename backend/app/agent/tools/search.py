from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.services.semantic_search_service import SemanticSearchService


@tool
def search_meetings(
    query: Annotated[
        str,
        "Question or search query about previous meetings.",
    ],
    deps: ToolDependencies = None,
) -> str:
    """
    Search previous meetings using semantic search based on natural language query.
    """
    logger.info(f"Executing search_meetings tool with query='{query}'")

    try:
        meetings = SemanticSearchService.search(
            db=deps.db,
            current_user=deps.current_user,
            query=query,
            limit=5,
        )

        if not meetings:
            logger.info("Semantic search returned 0 results.")
            return "No relevant meetings found."

        result = f"Found {len(meetings)} relevant meeting(s):\n\n"

        for meeting in meetings:
            result += f"""Meeting ID: {meeting.id}
Title: {meeting.title}
Summary: {meeting.summary or 'No summary available'}
----------------------------------------
"""

        return result.strip()

    except Exception as e:
        logger.exception(f"Error in search_meetings tool: {str(e)}")
        return f"Error performing semantic search: {str(e)}"