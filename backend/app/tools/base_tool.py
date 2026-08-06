from abc import ABC
from langchain_core.tools import BaseTool

from app.agent.context import AgentContext


class MeetingBaseTool(BaseTool, ABC):
    """
    Base class for all meeting tools.
    """

    context: AgentContext | None = None

    def set_context(
        self,
        context: AgentContext,
    ):
        self.context = context