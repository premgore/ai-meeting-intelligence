from langchain.agents import create_agent
from langchain_core.messages import HumanMessage

from app.agent_v2.context import AgentContext
from app.agent_v2.prompts import SYSTEM_PROMPT
from app.agent_v2.tool_registry import TOOLS
from app.core.langchain_client import llm


class MeetingAgent:

    def __init__(self):
        self.agent = create_agent(
            model=llm,
            tools=TOOLS,
            system_prompt=SYSTEM_PROMPT,
            context_schema=AgentContext,
            debug=True,
            name="meeting-agent",
        )

    def invoke(
        self,
        db,
        current_user,
        query: str,
    ) -> str:

        context = AgentContext(
            db=db,
            current_user=current_user,
        )

        result = self.agent.invoke(
            {
                "messages": [
                    HumanMessage(content=query)
                ]
            },
            context=context,
        )

        messages = result.get("messages", [])

        if not messages:
            return "No response generated."

        return messages[-1].content