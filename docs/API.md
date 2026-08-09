# Backend API Overview

## Base

Development server:

```text
http://localhost:8000
```

API prefix:

```text
/api/v1
```

FastAPI documentation:

```text
/docs
/redoc
/openapi.json
```

## API Areas

### Authentication
Registration, login, and JWT authentication.

### Users
Authenticated user operations.

### Meetings
Create, list, retrieve, update, and delete meetings.

### Audio
Audio upload and meeting processing.

### Chat
AI meeting questions and agent interaction.

### Reports
PDF/email reporting through existing backend services and agent tools.

## Security

Protected meeting endpoints must verify that the requested meeting belongs to the authenticated user.

The frontend should consume the existing API contract rather than inventing a separate backend contract.
