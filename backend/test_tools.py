"""
Verification test suite for all AI Agent tools in app.agent.tools.
"""
from unittest.mock import MagicMock

from app.agent.dependencies import ToolDependencies
from app.agent.meeting_agent import MeetingAgent
from app.agent.tool_registry import TOOLS
from app.agent.tools.action_items import get_action_items
from app.agent.tools.details import get_meeting_details
from app.agent.tools.email import email_meeting_report
from app.agent.tools.history import get_recent_meetings
from app.agent.tools.pdf import generate_pdf_report
from app.agent.tools.search import search_meetings
from app.agent.tools.summary import summarize_meeting


def test_tool_registrations():
    print("Testing Tool Registrations...")
    assert len(TOOLS) == 7, f"Expected 7 tools, found {len(TOOLS)}"
    tool_names = [t.name for t in TOOLS]
    expected_names = [
        "search_meetings",
        "get_recent_meetings",
        "get_meeting_details",
        "summarize_meeting",
        "get_action_items",
        "generate_pdf_report",
        "email_meeting_report",
    ]
    for name in expected_names:
        assert name in tool_names, f"Tool '{name}' not found in TOOLS registry!"
    print("✅ All 7 tools correctly registered in tool_registry.py")


def test_tools_execution_with_mock_deps():
    print("Testing Tool Invocation with Mock Context...")

    # Mock user and DB
    mock_user = MagicMock()
    mock_user.id = 1
    mock_db = MagicMock()

    # Configure mock DB query to return empty list by default
    mock_db.query.return_value.filter.return_value.all.return_value = []
    mock_db.query.return_value.filter.return_value.order_by.return_value.limit.return_value.all.return_value = []
    mock_db.query.return_value.filter.return_value.first.return_value = None

    deps = ToolDependencies(db=mock_db, current_user=mock_user)

    # 1. history tool
    res_history = get_recent_meetings.invoke({"limit": 5, "deps": deps})
    assert isinstance(res_history, str)
    print("  - get_recent_meetings: OK")

    # 2. details tool
    res_details = get_meeting_details.invoke({"meeting_id": 9999, "deps": deps})
    assert isinstance(res_details, str)
    print("  - get_meeting_details: OK")

    # 3. summary tool
    res_summary = summarize_meeting.invoke({"meeting_id": 9999, "deps": deps})
    assert isinstance(res_summary, str)
    print("  - summarize_meeting: OK")

    # 4. action_items tool
    res_actions = get_action_items.invoke({"scope": "all", "deps": deps})
    assert isinstance(res_actions, str)
    print("  - get_action_items: OK")

    # 5. pdf tool
    res_pdf = generate_pdf_report.invoke({"meeting_id": 9999, "deps": deps})
    assert isinstance(res_pdf, str)
    print("  - generate_pdf_report: OK")

    # 6. email tool
    res_email = email_meeting_report.invoke({
        "meeting_id": 9999,
        "recipients": ["test@example.com"],
        "deps": deps,
    })
    assert isinstance(res_email, str)
    print("  - email_meeting_report: OK")

    # 7. search tool
    res_search = search_meetings.invoke({"query": "product strategy", "deps": deps})
    assert isinstance(res_search, str)
    print("  - search_meetings: OK")

    print("✅ All tool invocations succeeded cleanly")


def test_agent_initialization():
    print("Testing MeetingAgent Initialization...")
    agent = MeetingAgent()
    assert agent is not None
    print("✅ MeetingAgent initialized successfully")


if __name__ == "__main__":
    test_tool_registrations()
    test_tools_execution_with_mock_deps()
    test_agent_initialization()
    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")
