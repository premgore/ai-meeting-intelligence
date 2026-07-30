from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Question about previous meetings",
        examples=[
            "What action items are pending?",
        ],
    )


class ChatResponse(BaseModel):
    answer: str