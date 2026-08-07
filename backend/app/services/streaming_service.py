from langchain_core.messages import HumanMessage

from app.agent_v2.context import AgentContext
from app.agent_v2.meeting_agent import MeetingAgent


class StreamingService:

    @staticmethod
    async def stream_answer(
        db,
        current_user,
        question: str,
    ):

        context = AgentContext(
            db=db,
            current_user=current_user,
        )

        agent = MeetingAgent()

        async for event in agent.agent.astream(
            {
                "messages": [
                    HumanMessage(
                        content=question,
                    )
                ]
            },
            context=context,
        ):

            yield event