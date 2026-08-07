from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models.user import User


@dataclass(slots=True)
class ToolDependencies:
    """
    Runtime dependencies injected into tools.
    """

    db: Session
    current_user: User