from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate

from app.core.langchain_client import llm


class SummaryService:

    @staticmethod
    def generate_summary(transcript: str) -> dict:
        """
        Generate an AI meeting summary using LangChain + Groq.
        """

        parser = JsonOutputParser()

        prompt = ChatPromptTemplate.from_template(
            """
You are an expert AI Meeting Assistant.

Analyze the following meeting transcript.

Return ONLY a valid JSON object.

{format_instructions}

Meeting Transcript:

{transcript}
"""
        )

        chain = (
            prompt
            | llm
            | parser
        )

        result = chain.invoke(
            {
                "transcript": transcript,
                "format_instructions": parser.get_format_instructions(),
            }
        )

        return result