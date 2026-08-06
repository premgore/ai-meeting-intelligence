from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    meeting_id: int = Field(
        ...,
        description="Meeting ID",
        examples=[12],
    )

    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Question about the meeting",
        examples=[
            "What action items are pending?",
        ],
    )


class ChatResponse(BaseModel):
    answer: str