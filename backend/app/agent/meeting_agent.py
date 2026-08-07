from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from app.agent.context import AgentContext
from app.agent.prompts import SYSTEM_PROMPT
from app.agent.tool_registry import TOOLS
from app.core.langchain_client import llm


class MeetingAgent:

    def __init__(self):

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", SYSTEM_PROMPT),
                ("human", "{input}"),
                MessagesPlaceholder(
                    variable_name="agent_scratchpad",
                ),
            ]
        )

        agent = create_tool_calling_agent(
            llm=llm,
            tools=TOOLS,
            prompt=prompt,
        )

        self.executor = AgentExecutor(
            agent=agent,
            tools=TOOLS,
            verbose=True,
        )

    def invoke(
        self,
        db,
        current_user,
        query: str,
    ):

        context = AgentContext(
            db=db,
            current_user=current_user,
        )

        for tool in self.executor.tools:
            if hasattr(tool, "set_context"):
                tool.set_context(context)

        try:
            return self.executor.invoke(
                {
                    "input": query,
                }
            )

        except Exception as e:
            return {
                "output": f"Agent failed: {str(e)}",
            }