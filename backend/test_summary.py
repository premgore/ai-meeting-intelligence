from pprint import pprint

from app.services.summary_service import SummaryService

transcript = """
John: We need to finish the authentication module this week.

Sarah: I will complete the dashboard UI.

Mike: We should deploy next Monday.

Everyone agreed to use JWT authentication.
"""

try:
    result = SummaryService.generate_summary(transcript)

    print("\n========== AI SUMMARY ==========\n")
    pprint(result)

except Exception as e:
    print("\nERROR:")
    print(e)