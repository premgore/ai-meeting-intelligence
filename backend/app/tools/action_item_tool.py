from langchain_core.tools import StructuredTool

from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.meeting_repository import MeetingRepository


def get_action_items(
    db: Session,
    current_user: User,
) -> str:
    """
    Return all action items from the user's meetings.
    """

    meetings = MeetingRepository.get_all_with_action_items(
        db=db,
        user_id=current_user.id,
    )

    if not meetings:
        return "No action items found."

    result = ""

    for meeting in meetings:

        result += f"""
Meeting {meeting.id}
Title: {meeting.title}

"""

        for item in meeting.action_items or []:
            result += f"• {item}\n"

        result += "\n-------------------------\n"

    return result


ActionItemsTool = StructuredTool.from_function(
    func=get_action_items,
    name="get_action_items",
    description=(
        "Return all action items from previous meetings."
    ),
)