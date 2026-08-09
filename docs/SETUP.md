# Backend Setup

## Clone

```bash
git clone https://github.com/premgore/ai-meeting-intelligence.git
cd ai-meeting-intelligence/backend
```

## Virtual Environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Environment

Create a backend `.env` file using the variable names required by the project's configuration module.

Never commit secrets.

## Database

Configure PostgreSQL and the project's database URL.

If vector search is enabled, PostgreSQL must have the required pgvector support.

## Migrations

```bash
alembic upgrade head
```

## Run

```bash
uvicorn app.main:app --reload
```

Then open:

```text
http://localhost:8000/docs
```
