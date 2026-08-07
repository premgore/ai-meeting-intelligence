from abc import ABC

from langchain_core.tools import BaseTool

from app.agent_v2.context import AgentContext


class MeetingBaseTool(BaseTool, ABC):
    """
    Base class for all meeting tools.
    """

    context: AgentContext | None = None

    def set_context(
        self,
        context: AgentContext,
    ) -> None:
        self.context = context

    def require_context(self) -> AgentContext:

        if self.context is None:
            raise RuntimeError(
                "AgentContext has not been injected."
            )

        return self.context