# AI Meeting Intelligence

> **Production-oriented AI Meeting Intelligence Platform built with FastAPI, PostgreSQL, pgvector, LangChain, LangGraph, Groq, and a modern React frontend.**

## 👋 What is this project?

**AI Meeting Intelligence** transforms meeting recordings into searchable, actionable intelligence.

Instead of treating a meeting as only an audio file, the platform creates a complete intelligence layer around it:

**Audio → Transcript → AI Analysis → Embeddings → Semantic Search → RAG → AI Agent → Actions**

The system can understand meeting content, retrieve relevant information, answer questions using meeting context, and execute meeting-related tools such as summaries, action-item retrieval, PDF generation, and email reporting.

---

# 🚀 Why this project is interesting

This is not simply an application that sends text to an LLM.

It combines:

- **Generative AI**
- **AI Agents**
- **RAG**
- **Vector Search**
- **Semantic Search**
- **Speech-to-Text**
- **Conversation Memory**
- **Tool Calling**
- **FastAPI**
- **PostgreSQL + pgvector**
- **Modern frontend engineering**

The architecture separates AI orchestration from business logic, database access, and API responsibilities.

---

# 🧠 AI Pipeline

```text
                    MEETING INGESTION

        ┌─────────────────────────────┐
        │       Meeting Audio         │
        └──────────────┬──────────────┘
                       ↓
                  ┌─────────┐
                  │ Whisper │
                  └────┬────┘
                       ↓
                 ┌───────────┐
                 │Transcript │
                 └─────┬─────┘
                       │
          ┌────────────┴────────────┐
          ↓                         ↓
   ┌──────────────┐        ┌─────────────────┐
   │ AI Analysis  │        │ Embedding Model │
   └──────┬───────┘        └────────┬────────┘
          │                          ↓
          ├─ Summary           Vector Embedding
          ├─ Action Items             │
          ├─ Key Decisions             ↓
          ├─ Risks             PostgreSQL
          └─ Sentiment          + pgvector
                                       │
                                       ↓
                                Semantic Search
                                       │
                                       ↓
                                   RAG Context
                                       │
                                       ↓
                                  AI Agent
                                       │
                         ┌─────────────┴─────────────┐
                         ↓                           ↓
                    Direct Answer               Tool Calling
                                                     │
                          ┌──────────────────────────┼───────────────┐
                          ↓                          ↓               ↓
                       Search                    Details          Summary
                          ↓                          ↓               ↓
                       History                 Action Items        PDF
                                                                        ↓
                                                                      Email
                                       │
                                       ↓
                                  Final Answer
                                       │
                                       ↓
                              Conversation Memory
```

---

# 🏗️ Architecture

```text
Frontend
   │
   │ REST API
   ↓
FastAPI
   │
   ├── Authentication / Authorization
   ├── Meeting APIs
   ├── Audio Upload
   └── AI Chat
           │
           ↓
      Meeting Agent
           │
      LangChain / LangGraph
           │
      ┌────┴──────────────────────────────┐
      │                                   │
      ↓                                   ↓
   LLM                                    Tools
  Groq                                  Tool Registry
Llama 3.3 70B                               │
                                      ┌────┼────┬────┬────┐
                                      ↓    ↓    ↓    ↓    ↓
                                    Search History Details Summary
                                      ↓
                                  Action Items
                                      ↓
                                      PDF
                                      ↓
                                     Email
      │
      ↓
Services
      │
      ↓
Repositories
      │
      ↓
PostgreSQL + pgvector
```

---

# 🛠️ Technology Stack

## Backend

| Technology | Purpose |
|---|---|
| **Python** | Backend language |
| **FastAPI** | REST API framework |
| **Pydantic** | Validation and schemas |
| **SQLAlchemy** | ORM / database access |
| **Alembic** | Database migrations |
| **PostgreSQL** | Primary database |
| **pgvector** | Vector storage and similarity search |

## AI / ML

| Technology | Purpose |
|---|---|
| **LangChain 1.x** | Agent and tool orchestration |
| **LangGraph** | Agent execution/stateful orchestration |
| **Groq** | LLM inference |
| **Llama 3.3 70B Versatile** | LLM |
| **Whisper** | Speech-to-text |
| **Sentence Transformers** | Meeting/query embeddings |
| **all-MiniLM-L6-v2** | Embedding model |
| **RAG** | Grounded meeting question answering |

## Frontend

The frontend is a modern React application built around:

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Framer Motion
- TanStack Query
- Axios
- React Hook Form
- Zod
- Lucide Icons

> The exact installed versions should be verified from the project's package files.

## Engineering

- Git
- GitHub
- REST APIs
- JWT Authentication
- Repository Pattern
- Service Layer
- Dependency Injection
- Environment-based configuration
- API documentation through FastAPI/OpenAPI

---

# 🤖 AI Agent

The platform contains a dedicated meeting AI agent.

The agent can reason about the user's request and decide whether it needs to use a meeting tool.

### Agent flow

```text
User
 ↓
Natural Language Query
 ↓
Meeting Agent
 ↓
LLM
 ↓
Tool Selection
 ↓
Tool Execution
 ↓
Tool Result
 ↓
LLM
 ↓
Final Response
```

### Meeting tools

- Search Meetings
- Meeting History
- Meeting Details
- Summary
- Action Items
- Generate PDF
- Email Report

Tools are designed to reuse existing services and repositories rather than duplicating business logic.

---

# 🔎 RAG & Semantic Search

The platform uses vector embeddings to make meeting information semantically searchable.

```text
Meeting Content
      ↓
Embedding Model
      ↓
Vector
      ↓
PostgreSQL + pgvector
```

When a user asks:

> "What did we decide about the product launch?"

the system can perform semantic retrieval rather than relying only on keyword matching.

```text
Question
   ↓
Query Embedding
   ↓
Vector Similarity Search
   ↓
Relevant Meetings
   ↓
Retrieved Context
   ↓
LLM
   ↓
Grounded Answer
```

This allows the AI to answer questions based on the user's meeting knowledge base.

---

# 🎤 Meeting Intelligence

For each processed meeting, the AI pipeline can extract:

### Summary
A concise understanding of the meeting.

### Action Items
Tasks and follow-ups identified from the discussion.

### Key Decisions
Important decisions made during the meeting.

### Risks
Potential issues or concerns identified from the discussion.

### Sentiment
Overall meeting sentiment analysis.

### Transcript
Searchable text generated from the audio recording.

---

# 🔐 Security

The backend includes:

- JWT authentication
- Protected API endpoints
- Authenticated user context
- User-scoped meeting access
- Pydantic request validation
- Environment-based secrets
- Production CORS considerations

A key architectural principle is:

> **The LLM is never responsible for authorization.**

Application-level authorization controls which meetings a user can access.

---

# 🗄️ Database Architecture

```text
Application
     ↓
SQLAlchemy
     ↓
Repository Layer
     ↓
PostgreSQL
     │
     ├── Users
     ├── Meetings
     ├── Meeting Intelligence
     ├── Conversations
     └── Embeddings
             ↓
          pgvector
```

Database migrations are managed with **Alembic**.

The exact schema should be treated as defined by the project's SQLAlchemy models and migration files.

---

# 🎨 Frontend Experience

The frontend provides an enterprise-style interface for interacting with the intelligence platform.

Core areas include:

- Authentication
- Dashboard
- Meetings
- Meeting Details
- AI Chat
- Audio Upload
- Analytics
- Reports
- Settings
- Profile

The UI uses reusable components, responsive layouts, loading states, error states, animations, and light/dark theme support.

---

# 📊 Current Product Capabilities

### Authentication
- User registration
- Login
- JWT authentication
- Protected APIs

### Meeting Management
- Create meetings
- View meetings
- Update meetings
- Delete meetings

### Audio Intelligence
- Audio upload
- Speech-to-text
- Transcript storage

### AI Intelligence
- Meeting summaries
- Action items
- Key decisions
- Risks
- Sentiment
- Semantic search
- RAG
- AI chat
- Conversation history

### AI Agent
- Tool calling
- Meeting search
- Meeting history
- Meeting details
- Summary
- Action items
- PDF reporting
- Email reporting

### Reporting
- PDF report generation
- Email reporting

---

# 💡 Engineering Decisions

## Why PostgreSQL + pgvector?

A single PostgreSQL-based data layer can store both structured application data and vector embeddings, reducing architectural complexity while supporting semantic retrieval.

## Why LangChain + LangGraph?

The project requires more than a single LLM request. The agent needs tool calling, orchestration, context, and controlled execution.

## Why an Agent?

A user should be able to interact with meetings naturally instead of learning separate API operations.

For example:

```text
"Show my latest meeting and list its pending action items."
```

The agent can determine which meeting information and tools are required.

## Why a Service + Repository architecture?

It keeps:

- API logic
- Business logic
- Database logic
- AI orchestration

separated and maintainable.

---

# 📈 Roadmap

## Completed

- [x] FastAPI backend
- [x] Authentication
- [x] Meeting management
- [x] Audio upload
- [x] Transcription
- [x] AI meeting analysis
- [x] PostgreSQL
- [x] pgvector
- [x] Embeddings
- [x] Semantic search
- [x] RAG
- [x] Conversation history
- [x] LangChain agent
- [x] LangGraph-based orchestration
- [x] AI tool layer
- [x] React frontend

## Next

- [ ] End-to-end production testing
- [ ] Background processing for long-running AI jobs
- [ ] Streaming AI responses
- [ ] Object storage for audio/PDF files
- [ ] Production observability
- [ ] Rate limiting
- [ ] Automated CI/CD
- [ ] Advanced speaker-aware analytics
- [ ] Calendar integrations
- [ ] Slack / Microsoft Teams integrations

---

# 🧪 Testing Strategy

The project should be tested at multiple levels:

```text
Unit Tests
    ↓
Service Tests
    ↓
Repository Tests
    ↓
API Tests
    ↓
AI / Tool Tests
    ↓
End-to-End Tests
```

Critical end-to-end scenario:

```text
Register
   ↓
Login
   ↓
Create Meeting
   ↓
Upload Audio
   ↓
Transcription
   ↓
AI Analysis
   ↓
Embedding
   ↓
Semantic Search
   ↓
Ask AI Question
   ↓
Agent Tool Call
   ↓
Final Answer
```

---

# ☁️ Deployment Target

Planned production architecture:

```text
                    INTERNET
                       │
              ┌────────┴────────┐
              ↓                 ↓
          Vercel             AWS EC2
          Frontend           FastAPI
                                 │
                         ┌───────┴────────┐
                         ↓                ↓
                    PostgreSQL         AI APIs
                    + pgvector        / Services
```

For production, durable object storage such as Amazon S3 is recommended for meeting audio and generated reports.

---

# 👨‍💻 What This Project Demonstrates

This project demonstrates practical experience across:

- Full-stack application development
- Backend architecture
- REST API design
- Authentication and authorization
- Relational databases
- Vector databases
- Semantic retrieval
- RAG systems
- AI agents
- Tool calling
- LLM integration
- Speech-to-text
- Prompt engineering
- AI application architecture
- Frontend engineering
- Cloud deployment architecture

---

# ⭐ Recruiter Summary

**AI Meeting Intelligence is a full-stack AI application that converts meeting recordings into structured, searchable intelligence. It combines FastAPI, PostgreSQL, pgvector, Whisper, Sentence Transformers, LangChain, LangGraph, and Groq's Llama model to create an end-to-end pipeline for transcription, meeting analysis, semantic retrieval, RAG, and agentic tool execution.**

The project demonstrates how an AI system can move beyond simple chatbot interactions into a **tool-using, retrieval-grounded application connected to real business data and workflows.**

---

# 📁 Documentation

For deeper technical details, see:

- `docs/backend/ARCHITECTURE.md`
- `docs/backend/AI_PIPELINE.md`
- `docs/backend/AGENT.md`
- `docs/backend/PROMPT_DESIGN.md`
- `docs/backend/DATABASE.md`
- `docs/backend/DATABASE_SCHEMA.md`
- `docs/backend/API.md`
- `docs/backend/SECURITY.md`
- `docs/backend/DEPLOYMENT.md`
- `docs/backend/ROADMAP.md`

---

## Repository

**GitHub:** `https://github.com/premgore/ai-meeting-intelligence`

> This document is intended to be the first technical overview a recruiter, hiring manager, interviewer, or engineer reads before exploring the codebase.
