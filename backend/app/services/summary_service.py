import json

from app.core.groq_client import client


class SummaryService:
    @staticmethod
    def generate_summary(transcript: str) -> dict:
        prompt = f"""
You are an AI meeting assistant.

Analyze the following meeting transcript and return ONLY a valid JSON object.

Required JSON format:

{{
    "summary": "...",
    "action_items": [
        "...",
        "..."
    ],
    "key_decisions": [
        "...",
        "..."
    ],
    "risks": [
        "...",
        "..."
    ],
    "sentiment": "Positive"
}}

Meeting Transcript:

{transcript}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )

        content = response.choices[0].message.content.strip()

        print("\n========== GROQ RESPONSE ==========")
        print(content)
        print("===================================\n")

        try:
            return json.loads(content)

        except json.JSONDecodeError:
            # Fallback: remove markdown code fences if present
            if content.startswith("```json"):
                content = content[len("```json"):].strip()

            if content.startswith("```"):
                content = content[3:].strip()

            if content.endswith("```"):
                content = content[:-3].strip()

            return json.loads(content)