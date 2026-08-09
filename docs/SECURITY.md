# Backend Security

## Authentication

JWT authentication protects private APIs.

## Authorization

Every meeting operation must enforce ownership against the authenticated user.

The LLM must never be trusted to enforce authorization.

## Secrets

Keep secrets in environment variables and secret-management systems.

Never commit credentials.

## CORS

Production CORS should allow only trusted frontend origins.

Avoid wildcard CORS for authenticated production APIs.

## Validation

Use Pydantic validation for API inputs and validate tool parameters.

## AI Security

Prompt instructions cannot override application permissions.

Database access must always go through application-controlled services/repositories.

## Logging

Do not log passwords, API keys, JWT secrets, or sensitive tokens.
