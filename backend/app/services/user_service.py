from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.logger import logger
from app.core.security import hash_password
from app.repositories.user_repository import UserRepository
from app.schemas.user import CreateUserRequest


class UserService:

    @staticmethod
    def create_user(
        db: Session,
        request: CreateUserRequest,
    ):

        existing_user = UserRepository.get_by_email(
            db,
            request.email,
        )

        if existing_user:

            logger.warning(
                f"User already exists with email={request.email}"
            )

            raise HTTPException(
                status_code=400,
                detail="Email already registered.",
            )

        hashed_password = hash_password(
            request.password,
        )

        logger.info(
            f"Creating user with email={request.email}"
        )

        user = UserRepository.create(
            db=db,
            request=request,
            hashed_password=hashed_password,
        )

        logger.info(
            f"User created successfully with ID={user.id}"
        )

        return user

    @staticmethod
    def get_all_users(
        db: Session,
    ):

        users = UserRepository.get_all(db)

        logger.info(
            f"Fetched {len(users)} user(s)"
        )

        return users

    @staticmethod
    def get_user_by_id(
        db: Session,
        user_id: int,
    ):

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if not user:

            logger.warning(
                f"User not found with ID={user_id}"
            )

            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        logger.info(
            f"Fetched user with ID={user_id}"
        )

        return user