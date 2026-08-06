from langchain_core.messages import HumanMessage, SystemMessage

from app.core.langchain_client import llm


class RAGService:
    """
    Handles all LLM interactions for RAG.
    """

    @staticmethod
    def build_context(meetings) -> str:
        """
        Convert meetings into a prompt context.
        """

        context = ""

        for meeting in meetings:
            context += f"""
Meeting ID: {meeting.id}
Meeting Title: {meeting.title}

Transcript:
{meeting.transcript}

Summary:
{meeting.summary or "Not Available"}

Action Items:
{meeting.action_items or []}

Key Decisions:
{meeting.key_decisions or []}

Risks:
{meeting.risks or []}

Sentiment:
{meeting.sentiment or "Unknown"}

---------------------------------------
"""

        return context

    @staticmethod
    def generate_answer(
        context: str,
        history: list,
        question: str,
    ) -> str:
        """
        Generate an answer using LangChain + Groq.
        """

        system_prompt = f"""
You are an AI Meeting Assistant.

Answer ONLY using the meeting information below.

If the answer cannot be found,
reply exactly:

"I couldn't find that information in your meetings."

Meeting Context:

{context}
"""

        messages = [
            SystemMessage(content=system_prompt),
        ]

        messages.extend(history)

        messages.append(
            HumanMessage(content=question)
        )

        response = llm.invoke(messages)

        return response.content