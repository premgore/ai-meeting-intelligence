from sqlalchemy.orm import Session

from app.models.user import User


class AgentContext:

    def __init__(
        self,
        db: Session,
        current_user: User,
    ):
        self.db = db
        self.current_user = current_user