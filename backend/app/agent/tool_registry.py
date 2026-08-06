from app.tools.action_item_tool import ActionItemsTool
from app.tools.email_tool import EmailReportTool
from app.tools.meeting_details_tool import MeetingDetailsTool
from app.tools.meeting_history_tool import MeetingHistoryTool
from app.tools.pdf_tool import GeneratePDFTool
from app.tools.search_tool import SearchMeetingTool
from app.tools.summary_tool import SummaryTool


TOOLS = [
    SearchMeetingTool(),
    GeneratePDFTool(),
    EmailReportTool(),
    SummaryTool(),
    ActionItemsTool(),
    MeetingDetailsTool(),
    MeetingHistoryTool(),
]