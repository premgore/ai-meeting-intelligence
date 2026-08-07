from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models.user import User


@dataclass(slots=True)
class AgentContext:
    """
    Runtime context available to the AI agent during a request.
    """

    db: Session
    current_user: User