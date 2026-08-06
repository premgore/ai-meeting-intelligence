from langchain_core.tools import StructuredTool

from app.tools.search_service import search_meetings


SearchMeetingTool = StructuredTool.from_function(
    func=search_meetings,
    name="search_meetings",
    description=(
        "Search meetings using semantic search. "
        "Use this whenever the user asks "
        "to find meetings, topics or discussions."
    ),
)