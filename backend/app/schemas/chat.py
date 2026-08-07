from pydantic import BaseModel, Field


class ChatRequest(BaseModel):

    meeting_id: int = Field(
        ...,
        gt=0,
        description="Meeting ID",
    )

    question: str = Field(
        ...,
        min_length=3,
        max_length=1000,
        description="Question about meetings",
    )


class ChatResponse(BaseModel):
    answer: str