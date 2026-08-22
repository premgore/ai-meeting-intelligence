from typing import Annotated

from langchain.tools import tool, ToolRuntime

from app.agent.context import AgentContext, extract_context
from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.services.semantic_search_service import SemanticSearchService


@tool
def search_meetings(
    query: Annotated[
        str,
        "Question or search query about previous meetings.",
    ],
    runtime: ToolRuntime[AgentContext] | None = None,
    deps: ToolDependencies | None = None,
) -> str:
    """
    Search previous meetings using semantic search based on natural language query.
    """
    logger.info(
        f"Executing search_meetings tool with query='{query}'"
    )

    try:
        ctx = extract_context(runtime, deps)
        if not ctx:
            return "Error: Runtime context or dependencies missing."

        db = ctx.db
        current_user = ctx.current_user

        meetings = SemanticSearchService.search(
            db=db,
            current_user=current_user,
            query=query,
            limit=5,
        )

        if not meetings:
            logger.info(
                "Semantic search returned 0 results."
            )
            return "No relevant meetings found."

        result = (
            f"Found {len(meetings)} relevant meeting(s):\n\n"
        )

        for meeting in meetings:
            result += (
                f"Meeting ID: {meeting.id}\n"
                f"Title: {meeting.title}\n"
                f"Summary: "
                f"{meeting.summary or 'No summary available'}\n"
                f"----------------------------------------\n"
            )

        return result.strip()

    except Exception as e:
        logger.exception(
            f"Error in search_meetings tool: {str(e)}"
        )
        return f"Error performing semantic search: {str(e)}"
