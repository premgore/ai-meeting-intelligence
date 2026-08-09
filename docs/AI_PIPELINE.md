# AI Pipeline

This document describes the AI pipeline implemented in the backend.

## 1. Audio → Transcript

```text
Meeting Audio
     |
     v
FastAPI Upload
     |
     v
Whisper
     |
     v
Transcript
```

Whisper converts the meeting recording into text.

## 2. Transcript → Meeting Intelligence

```text
Transcript
     |
     v
LLM Analysis
     |
     +--> Summary
     +--> Action Items
     +--> Key Decisions
     +--> Risks
     +--> Sentiment
     |
     v
PostgreSQL
```

## 3. Transcript/Meeting Content → Embedding

```text
Meeting Content
     |
     v
sentence-transformers/all-MiniLM-L6-v2
     |
     v
Vector Embedding
     |
     v
PostgreSQL + pgvector
```

## 4. User Question → Semantic Search

```text
User Question
     |
     v
Embedding Model
     |
     v
Query Vector
     |
     v
pgvector Similarity Search
     |
     v
Relevant Meetings
```

Search is scoped to the authenticated user.

## 5. RAG Question Answering

```text
Question
   |
   v
Semantic Search
   |
   v
Relevant Meetings
   |
   v
RAG Context
   |
   v
LLM
   |
   v
Grounded Answer
```

The purpose of RAG is to ground answers in retrieved meeting information rather than relying only on model knowledge.

## 6. Conversation Memory

```text
User Question
     |
     +--> Save user message
     |
     v
Load conversation history
     |
     v
Agent / RAG
     |
     v
AI Answer
     |
     +--> Save assistant message
```

## 7. Agent Pipeline

```text
User Query
    |
    v
MeetingAgent
    |
    v
LangChain 1.x / LangGraph
    |
    v
LLM decides:
    |
    +-------------------+
    |                   |
    v                   v
Direct Answer       Tool Call
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

## 8. Complete End-to-End Pipeline

```text
                    MEETING INGESTION

Audio
  |
  v
Whisper
  |
  v
Transcript
  |
  +-----------------------------+
  |                             |
  v                             v
AI Analysis                Embedding Model
  |                             |
  +--> Summary                  v
  +--> Action Items        Vector Embedding
  +--> Decisions                 |
  +--> Risks                     v
  +--> Sentiment          PostgreSQL + pgvector
  |                             |
  v                             |
PostgreSQL                      |
                                |
                                v
                         Semantic Search
                                |
                                v
                         Relevant Meetings
                                |
                                v
                              RAG


                    USER INTERACTION

User Question
     |
     v
MeetingAgent
     |
     +--> Semantic Search / RAG
     |
     +--> Meeting History
     |
     +--> Meeting Details
     |
     +--> Summary
     |
     +--> Action Items
     |
     +--> PDF
     |
     +--> Email
     |
     v
LLM
     |
     v
Final Answer
     |
     v
Conversation History
```

## AI Components

| Component | Purpose |
|---|---|
| Whisper | Speech-to-text |
| Groq / Llama 3.3 70B Versatile | LLM generation/reasoning |
| LangChain 1.x | Agent and tool orchestration |
| LangGraph | Agent execution/stateful orchestration |
| all-MiniLM-L6-v2 | Embeddings |
| pgvector | Vector similarity search |
| RAG | Grounded meeting Q&A |
