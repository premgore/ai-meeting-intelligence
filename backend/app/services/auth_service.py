from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    verify_password,
)
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenResponse


class AuthService:
    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str,
    ) -> TokenResponse:
        """
        Authenticate user and generate JWT access token.
        """

        # Find user by email
        user = UserRepository.get_by_email(
            db,
            email,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # Verify password
        if not verify_password(
            password,
            user.password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # Generate JWT token
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            ),
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
        )