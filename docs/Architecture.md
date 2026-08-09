# Backend Architecture

## Layered Architecture

```text
API Layer
   |
   v
Service Layer
   |
   v
Repository Layer
   |
   v
PostgreSQL
```

AI orchestration sits above the service/repository layers:

```text
FastAPI
   |
   v
ChatService
   |
   v
MeetingAgent
   |
   v
Tool Registry
   |
   v
Services / Repositories
   |
   v
PostgreSQL + pgvector
```

## Main Directories

### `app/api/`
FastAPI routes, request validation, authentication dependencies, and response formatting.

### `app/services/`
Business logic such as meeting processing, summaries, conversation memory, semantic search, RAG, PDF generation, and email.

### `app/repositories/`
Database access abstraction.

### `app/models/`
SQLAlchemy models.

### `app/schemas/`
Pydantic request/response schemas.

### `app/agent/`
The single production AI-agent implementation.

## Agent

```text
MeetingAgent
    |
    v
LangChain 1.x `create_agent`
    |
    v
LangGraph
    |
    +--> LLM
    |
    +--> Tool Registry
             |
             +--> Search
             +--> History
             +--> Details
             +--> Summary
             +--> Action Items
             +--> PDF
             +--> Email
```

## Principles

1. API endpoints stay thin.
2. Business logic belongs in services.
3. Database operations belong in repositories.
4. AI orchestration belongs in the agent layer.
5. Tools reuse existing services/repositories.
6. Authorization is enforced by application code, not by the LLM.
7. Maintain one production agent implementation.
