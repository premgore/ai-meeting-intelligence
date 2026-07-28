from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import CreateUserRequest


class UserRepository:

    @staticmethod
    def create(
        db: Session,
        request: CreateUserRequest,
        hashed_password: str,
    ) -> User:

        user = User(
            name=request.name,
            email=request.email,
            password=hashed_password,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def get_all(db: Session):

        return db.query(User).all()

    @staticmethod
    def get_by_id(
        db: Session,
        user_id: int,
    ):

        return (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

    @staticmethod
    def get_by_email(
        db: Session,
        email: str,
    ):

        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )