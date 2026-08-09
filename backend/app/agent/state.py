from typing import Annotated, TypedDict

from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    """
    Shared state passed between LangGraph nodes.
    """

    messages: Annotated[list, add_messages]