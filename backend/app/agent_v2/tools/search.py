from typing import Annotated

from langchain.tools import tool

from app.agent_v2.dependencies import ToolDependencies
from app.services.semantic_search_service import SemanticSearchService


@tool
def search_meetings(
    query: Annotated[
        str,
        "Question or search query about previous meetings.",
    ],
    deps: ToolDependencies,
) -> str:
    """
    Search previous meetings using semantic search.
    """

    meetings = SemanticSearchService.search(
        db=deps.db,
        current_user=deps.current_user,
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

    return result