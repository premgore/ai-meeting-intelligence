from app.schemas.meeting import CreateMeetingRequest

meetings = []


class MeetingService:

    @staticmethod
    def create_meeting(request: CreateMeetingRequest):

        meeting = {
            "id": len(meetings) + 1,
            "title": request.title,
            "description": request.description,
        }

        meetings.append(meeting)

        return meeting

    @staticmethod
    def get_all_meetings():
        return meetings