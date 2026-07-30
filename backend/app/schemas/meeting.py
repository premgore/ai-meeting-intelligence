from pydantic import BaseModel, ConfigDict, Field


class CreateMeetingRequest(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Meeting title",
        examples=["Sprint Planning"]
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=500,
        description="Meeting description",
        examples=["Discuss sprint backlog and tasks."]
    )
class MeetingResponse(BaseModel):
    id: int
    title: str
    description: str
    transcript: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UpdateMeetingRequest(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=500
    )

