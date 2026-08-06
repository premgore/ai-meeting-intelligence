from app.repositories.meeting_repository import MeetingRepository
from app.tools.base_tool import MeetingBaseTool


class MeetingDetailsTool(MeetingBaseTool):

    name = "meeting_details"

    description = "Return complete meeting details."

    def _run(
        self,
        meeting_id: int,
    ) -> str:

        meeting = MeetingRepository.get_by_id(
            self.context.db,
            meeting_id,
        )

        if meeting is None:
            return "Meeting not found."

        return f"""
Title:
{meeting.title}

Summary:
{meeting.summary}

Transcript:
{meeting.transcript}
"""