from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CreateMeetingRequest(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=100,
        description="Meeting title",
        examples=["Sprint Planning"],
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=500,
        description="Meeting description",
        examples=["Discuss sprint backlog and tasks."],
    )


class MeetingResponse(BaseModel):
    id: int
    title: str
    description: str

    audio_path: str | None = None
    transcript: str | None = None

    # AI Generated Insights
    summary: str | None = None
    action_items: list[str] | None = None
    key_decisions: list[str] | None = None
    risks: list[str] | None = None
    sentiment: str | None = None

    model_config = ConfigDict(from_attributes=True)


class UpdateMeetingRequest(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )

    description: str = Field(
        ...,
        min_length=10,
        max_length=500,
    )


class SendMeetingReportRequest(BaseModel):
    recipients: list[EmailStr] = Field(
        ...,
        min_length=1,
        description="Email recipients",
        examples=[
            [
                "prem@example.com",
                "manager@example.com",
            ]
        ],
    )