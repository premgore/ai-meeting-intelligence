from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService
from fastapi import Depends

from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User Login",
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticate a user and return a JWT access token.
    """
    return AuthService.login(
        db=db,
        request=request,
    )