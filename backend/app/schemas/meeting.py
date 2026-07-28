from pydantic import BaseModel, Field


class CreateMeetingRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=5, max_length=500)


class MeetingResponse(BaseModel):
    id: int
    title: str
    description: str