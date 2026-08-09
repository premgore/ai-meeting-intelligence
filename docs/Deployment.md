# Backend Deployment

## Recommended Architecture

```text
Internet
   |
   v
HTTPS / Reverse Proxy
   |
   v
AWS EC2
   |
   +--> FastAPI
   |
   +--> LangChain / LangGraph
   |
   +--> External AI APIs
   |
   v
Managed PostgreSQL + pgvector
```

## EC2 Deployment

1. Create Ubuntu EC2 instance.
2. Configure SSH, HTTP, and HTTPS security-group rules.
3. Install Git and Python.
4. Clone the repository.
5. Create a Python virtual environment.
6. Install requirements.
7. Configure production environment variables.
8. Configure managed PostgreSQL.
9. Run `alembic upgrade head`.
10. Test Uvicorn.
11. Run FastAPI through systemd.
12. Put Nginx in front of FastAPI.
13. Configure HTTPS.
14. Configure production CORS.
15. Run end-to-end tests.

## Storage

Audio and generated PDF files should use durable object storage such as S3 in production rather than relying on local application disk for long-term storage.

## Secrets

Never commit:
- `.env`
- API keys
- JWT secrets
- database passwords
- SMTP credentials
- private keys
