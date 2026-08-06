from app.agent.meeting_agent import MeetingAgent

agent = MeetingAgent()

response = agent.invoke(
    "Show my recent meetings"
)

print(response)