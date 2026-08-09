from langchain_core.messages import HumanMessage

from app.agent.context import AgentContext
from app.agent.meeting_agent import MeetingAgent


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