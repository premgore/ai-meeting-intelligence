from dataclasses import dataclass
from typing import Any

from sqlalchemy.orm import Session

from app.models.user import User


@dataclass(slots=True)
class AgentContext:
    """
    Runtime context available to the AI agent during a request.
    """

    db: Session
    current_user: User


def extract_context(runtime: Any = None, deps: Any = None) -> Any:
    """
    Extract AgentContext or ToolDependencies regardless of invocation method.
    """
    target = runtime if runtime is not None else deps
    if target is None:
        return None
    if hasattr(target, "context") and target.context is not None:
        return target.context
    return target