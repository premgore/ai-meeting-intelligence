# AI Meeting Intelligence — Backend

The backend is the core intelligence layer of the AI Meeting Intelligence platform. It provides authentication, meeting management, audio processing, transcription, AI analysis, semantic retrieval, conversation memory, RAG, and an AI agent capable of using meeting-related tools.

## Technology Stack

- Python
- FastAPI
- Pydantic v2
- SQLAlchemy
- Alembic
- PostgreSQL
- pgvector
- LangChain 1.x
- LangGraph
- Groq
- Llama 3.3 70B Versatile
- Sentence Transformers (`all-MiniLM-L6-v2`)
- Whisper
- ReportLab
- Git / GitHub

Exact installed versions should be taken from `requirements.txt` and the active environment.

## Architecture

```text
Client
  |
  v
FastAPI
  |
  +--> Authentication / Authorization
  +--> Meeting APIs
  +--> Audio / Transcription
  +--> Chat API
          |
          v
      Meeting Agent
          |
          +--> Search
          +--> History
          +--> Details
          +--> Summary
          +--> Action Items
          +--> PDF
          +--> Email
          |
          v
      Services / Repositories
          |
          v
   PostgreSQL + pgvector
```

## Core Features

- JWT authentication
- Meeting CRUD
- Audio upload
- Whisper transcription
- AI summary
- Action items
- Key decisions
- Risks
- Sentiment
- Semantic search
- RAG
- Conversation history
- LangChain/LangGraph agent
- Tool calling
- PDF reports
- Email reports

Business logic should remain in services/repositories; agent tools should reuse that logic.
