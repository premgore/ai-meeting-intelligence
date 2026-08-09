from typing import Annotated

# pyrefly: ignore [missing-import]
from langchain.tools import tool

from app.agent.dependencies import ToolDependencies
from app.core.logger import logger
from app.repositories.meeting_repository import MeetingRepository


@tool
def get_action_items(
    scope: Annotated[
        str,
        "Scope of action items to collect: 'all' (default), 'latest', or 'specific'.",
    ] = "all",
    meeting_id: Annotated[
        int | None,
        "Meeting ID required if scope is 'specific'. Optional otherwise.",
    ] = None,
    deps: ToolDependencies = None,
) -> str:
    """
    Collect and return action items from meetings as a clean checklist. Supports scope='all', 'latest', or 'specific'.
    """
    logger.info(
        f"Executing get_action_items tool with scope='{scope}', meeting_id={meeting_id}"
    )

    try:
        scope_normalized = scope.lower().strip() if scope else "all"

        if scope_normalized == "specific" or meeting_id is not None:
            if meeting_id is None:
                return "Error: meeting_id must be provided when scope is 'specific'."

            meeting = MeetingRepository.get_by_id(deps.db, meeting_id)
            if meeting is None:
                return f"Meeting with ID {meeting_id} not found."
            if meeting.user_id != deps.current_user.id:
                return f"Access denied for meeting ID {meeting_id}."

            if not meeting.action_items:
                return f"No action items found for Meeting ID {meeting.id} ('{meeting.title}')."

            items_list = "\n".join([f"- [ ] {item}" for item in meeting.action_items])
            return f"Action Items for Meeting ID {meeting.id} ('{meeting.title}'):\n\n{items_list}"

        elif scope_normalized == "latest":
            recent_meetings = MeetingRepository.get_recent_meetings(
                deps.db, deps.current_user.id, limit=1
            )
            if not recent_meetings:
                return "No meetings found."

            latest_meeting = recent_meetings[0]
            if not latest_meeting.action_items:
                return f"No action items found for the latest meeting (ID: {latest_meeting.id}, Title: '{latest_meeting.title}')."

            items_list = "\n".join([f"- [ ] {item}" for item in latest_meeting.action_items])
            return f"Action Items for Latest Meeting (ID: {latest_meeting.id}, '{latest_meeting.title}'):\n\n{items_list}"

        else:
            # scope == 'all' or default fallback
            meetings = MeetingRepository.get_all_with_action_items(
                deps.db, deps.current_user.id
            )
            if not meetings:
                return "No action items found across any of your meetings."

            result = "Action Items Checklist Across All Meetings:\n"
            total_items = 0

            for meeting in meetings:
                if meeting.action_items:
                    result += f"\n📋 Meeting ID {meeting.id}: {meeting.title}\n"
                    for item in meeting.action_items:
                        result += f"  - [ ] {item}\n"
                        total_items += 1

            if total_items == 0:
                return "No action items found across any of your meetings."

            return result.strip()

    except Exception as e:
        logger.exception(f"Error in get_action_items tool: {str(e)}")
        return f"Error retrieving action items: {str(e)}"
