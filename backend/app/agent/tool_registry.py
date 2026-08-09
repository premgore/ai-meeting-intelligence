from app.agent.tools.action_items import get_action_items
from app.agent.tools.details import get_meeting_details
from app.agent.tools.email import email_meeting_report
from app.agent.tools.history import get_recent_meetings
from app.agent.tools.pdf import generate_pdf_report
from app.agent.tools.search import search_meetings
from app.agent.tools.summary import summarize_meeting

TOOLS = [
    search_meetings,
    get_recent_meetings,
    get_meeting_details,
    summarize_meeting,
    get_action_items,
    generate_pdf_report,
    email_meeting_report,
]