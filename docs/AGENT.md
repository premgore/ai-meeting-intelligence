# AI Meeting Agent

## Purpose

The Meeting Agent provides a natural-language interface to the user's meeting intelligence.

Examples:

- Show my recent meetings.
- What action items are pending?
- Summarize meeting 12.
- Show details for meeting 12.
- Generate a PDF report.
- Email the report.

## Stack

- LangChain 1.x
- LangGraph
- Groq
- Llama 3.3 70B Versatile

## Flow

```text
User Query
   |
   v
MeetingAgent
   |
   v
LLM
   |
   +--> Direct Answer
   |
   +--> Tool Call
          |
          v
      Tool Registry
          |
          v
      Tool Execution
          |
          v
      Tool Result
          |
          v
         LLM
          |
          v
     Final Answer
```

## Tool Set

- Search Meetings
- Meeting History
- Meeting Details
- Summary
- Action Items
- Generate PDF
- Email Report

## Rules

- Reuse existing services and repositories.
- Do not duplicate business logic.
- Validate tool inputs.
- Enforce user ownership at the application layer.
- Do not expose secrets or database credentials to the model.
- Log meaningful failures.
- Keep the tool registry as the single source of tool registration.
